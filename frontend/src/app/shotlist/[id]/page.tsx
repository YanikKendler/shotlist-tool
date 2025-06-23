'use client'

import gql from "graphql-tag"
import React, {use, useEffect, useRef, useState} from "react"
import {useApolloClient} from "@apollo/client"
import Scene from "@/components/scene/scene"
import {
    SceneDto,
    ShotAttributeDefinitionBase,
    ShotlistDto, UserDto
} from "../../../../lib/graphql/generated"
import { useParams, useRouter, useSearchParams} from "next/navigation"
import ShotTable, {ShotTableRef} from "@/components/shotTable/shotTable"
import {FileSliders, House, Plus, User} from "lucide-react"
import Link from "next/link"
import './shotlist.scss'
import { Tooltip } from "radix-ui"
import ErrorPage from "@/pages/errorPage/errorPage"
import {ShotlistContext} from "@/context/ShotlistContext"
import ShotlistOptionsDialog, {
    ShotlistOptionsDialogPage,
    ShotlistOptionsDialogSubPage
} from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {apolloClient} from "@/ApolloWrapper"
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import auth from "@/Auth"
import {useAccountDialog} from "@/components/dialog/accountDialog/accountDialog"
import {wuGeneral} from "@yanikkendler/web-utils/dist"
import Iconmark from "@/components/iconmark"
import {Metadata} from "next"
import {driver} from "driver.js"
import "driver.js/dist/driver.css";

export default function Shotlist() {
    const params = useParams<{ id: string }>()
    const id = params?.id || ""
    const searchParams = useSearchParams()
    const sceneId = searchParams?.get('sid')

    const [shotlist, setShotlist] = useState<{data: ShotlistDto , loading: boolean, error: any}>({data: {} as ShotlistDto, loading: true, error: null})
    const [selectedSceneId, setSelectedSceneId] = useState(sceneId || "")
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)
    const [selectedOptionsDialogPage, setSelectedOptionsDialogPage] = useState<{main: ShotlistOptionsDialogPage, sub: ShotlistOptionsDialogSubPage}>({main: "general", sub: "shot"})
    const [elementIsBeingDragged, setElementIsBeingDragged] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)
    const [isReadOnly, setIsReadOnly] = useState(false)

    const shotTableRef = useRef<ShotTableRef>(null);

    const client = useApolloClient()
    const router = useRouter()
    const {openAccountDialog, AccountDialog} = useAccountDialog()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const driverObj = driver({
        showProgress: true,
        steps: [
            { popover: { title: 'Your first Shotlist', description: 'This is where the fun beginns!' } },
            { element: '#sceneList', popover: { title: 'Scenes', description: 'Each scene has a number and a displayname, the latter is simply a combination of all its attributes. Every scene has the same attributes which are defined via the shotlist options.', side: "right", align: 'center' }},
            { element: '#shotTable', popover: { title: 'Shots', description: 'Here you see all the shots of the currently selected scene. Each shot has a few attributes which are defined via the shotlist options.', side: "over", align: 'center' }},
            { element: '#shotlistOptions', popover: { title: 'Shotlist Options', description: 'Click here to open the shotlist options menu.', side: "top", align: 'center' }},
        ]
    })

    useEffect(() => {
        const url = new URL(window.location.href)
        if(url.searchParams.get("oo") == "true") {
            let currentOptionsMainPage = url.searchParams.get("mp")
            let currentOptionsSubPage = url.searchParams.get("sp")

            if(!currentOptionsMainPage || currentOptionsMainPage == "") currentOptionsMainPage = "general"
            if(!currentOptionsSubPage || currentOptionsSubPage == "") currentOptionsSubPage = "shot"

            setSelectedOptionsDialogPage({
                main: currentOptionsMainPage as ShotlistOptionsDialogPage,
                sub: currentOptionsSubPage as ShotlistOptionsDialogSubPage
            })
            setOptionsDialogOpen(true)
        }
    }, [])

    useEffect(() => {
        if(!auth.isAuthenticated()){
            router.replace('/')
            return
        }

        if(!auth.getUser()) return

        loadData(true)
    }, [id])

    useEffect(() => {
        if(!shotlist.loading && !shotlist.error && shotlist.data && shotlist.data.id) {
            if(localStorage["shotly-shotlist-tour-completed"] != "true") {
                localStorage["shotly-shotlist-tour-completed"] = "true"
                driverObj.drive()
            }
        }
    }, [shotlist]);

    const loadData = async (noCache: boolean = false) => {
        try {
            const {data, errors, loading} = await client.query({
                query: gql`
                    query shotlist($id: String!){
                        shotlist(id: $id){
                            id
                            name
                            scenes{
                                id
                                position
                                attributes{
                                    id
                                    definition{id, name, position}

                                    ... on SceneSingleSelectAttributeDTO{
                                        singleSelectValue{id,name}
                                    }

                                    ... on SceneMultiSelectAttributeDTO{
                                        multiSelectValue{id,name}
                                    }
                                    ... on SceneTextAttributeDTO{
                                        textValue
                                    }
                                }
                            }
                            sceneAttributeDefinitions{
                                id
                                name
                                position
                            }
                            shotAttributeDefinitions{
                                id
                                name
                                position
                            }
                            owner {
                                id
                                tier
                                shotlistCount
                            }
                        }
                    }`,
                variables: {id: id},
                fetchPolicy: noCache ? "no-cache" : "cache-first"
            })

            console.log(data.shotlist)

            if(data.shotlist.owner.tier == "BASIC" && data.shotlist.owner.shotlistCount > 1) {
                setIsReadOnly(true)
            }

            setShotlist({data: data.shotlist, loading: loading, error: errors})
        }
        catch (e) {
            console.error(e)
            setShotlist({data: {} as ShotlistDto, loading: false, error: e})
        }
    }

    const updateShotlistName = async (name: string) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation updateShotlist($shotlistId: String!, $name: String!) {
                    updateShotlist(editDTO: {
                        id: $shotlistId
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { shotlistId: id, name: name },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        setShotlist({
            ...shotlist,
            data: {
                ...shotlist.data,
                name: data.updateShotlist.name
            }
        })
    }

    const debounceUpdateShotlistName = wuGeneral.debounce(updateShotlistName)

    const selectScene = (sceneId: string) => {
        setSelectedSceneId(sceneId)

        const url = new URL(window.location.href)
        url.searchParams.set("sid", sceneId)
        router.push(url.toString())
    }

    const removeScene = (sceneId: string) => {
        if(!shotlist.data.scenes) return

        let currentScenes = shotlist.data.scenes as SceneDto[]
        let newScenes: SceneDto[] = currentScenes.filter((scene: SceneDto) => scene.id != sceneId)

        setShotlist({
            ...shotlist,
            data: {
                ...shotlist.data,
                scenes: newScenes
            }
        })

        setSelectedSceneId("")
    }

    const createScene = async () => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation createScene($shotlistId: String!) {
                    createScene(shotlistId: $shotlistId){
                        id
                        position
                        attributes{
                            id
                            definition{id, name, position}

                            ... on SceneSingleSelectAttributeDTO{
                                singleSelectValue{id,name}
                            }

                            ... on SceneMultiSelectAttributeDTO{
                                multiSelectValue{id,name}
                            }
                            ... on SceneTextAttributeDTO{
                                textValue
                            }
                        }
                    }
                }
            `,
            variables: { shotlistId: id },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        let currentScenes = shotlist.data.scenes as SceneDto[]
        let newScenes: SceneDto[] = []
        if(currentScenes) newScenes = [...currentScenes]
        newScenes.push(data.createScene)

        setShotlist({
            ...shotlist,
            data: {
                ...shotlist.data,
                scenes: newScenes
            }
        })

        selectScene(data.createScene.id)
    }

    function handleDragEnd(event: any) {
        setElementIsBeingDragged(false)

        const {active, over} = event;

        if (active.id !== over.id && shotlist && shotlist.data.scenes && shotlist.data.scenes.length > 0) {
            setShotlist(() => {
                const oldIndex = shotlist.data.scenes!.findIndex((scene) => scene!.id === active.id);
                const newIndex = shotlist.data.scenes!.findIndex((scene) => scene!.id === over.id);

                apolloClient.mutate({
                    mutation: gql`
                        mutation updateScene($id: String!, $position: Int!) {
                            updateScene(editDTO:{
                                id: $id,
                                position: $position
                            }){
                                id
                                position
                            }
                        }
                    `,
                    variables: {id: active.id, position: newIndex},
                }).then(result => {
                    console.log(result)
                })

                let newData = {...shotlist.data}
                newData.scenes = arrayMove(newData.scenes || [], oldIndex, newIndex)

                return {data: newData, error: shotlist.error, loading: shotlist.loading}
            })
        }
    }

    const openShotlistOptionsDialog = (page: { main: ShotlistOptionsDialogPage, sub?: ShotlistOptionsDialogSubPage }) => {
        setSelectedOptionsDialogPage({main: page.main, sub: page.sub || "shot"})
        setOptionsDialogOpen(true)
    }

    if(shotlist.error) return <ErrorPage settings={{
        title: 'Data could not be loaded',
        description: shotlist.error.message,
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>

    if(shotlist.loading) return <LoadingPage text={"loading shotlist"}/>

    if(!shotlist.data) return <ErrorPage settings={{
        title: '404',
        description: 'Sorry, we could not find the shotlist you were looking for. Please check the URL or return to the dashboard.',
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>

    if(selectedSceneId == "" && shotlist?.data?.scenes && shotlist.data.scenes[0]?.id != undefined) setSelectedSceneId(shotlist?.data?.scenes[0].id)

    return (
        <ShotlistContext.Provider value={{
            openShotlistOptionsDialog: openShotlistOptionsDialog,
            elementIsBeingDragged: elementIsBeingDragged,
            setElementIsBeingDragged: setElementIsBeingDragged
        }}>
            <p className="noMobile">Sorry, mobile mode is not supported yet since this is a beta test. An acceptable mobile version will be available in the full release.</p>
            {
                isReadOnly &&
                <p className="readonly">This Shotlist is in <span className={"bold"}>read-only</span> mode because the shotlists owner has exceeded the maximum number of Shotlist available with the basic tier.</p>
            }
            <main className="shotlist" key={reloadKey}>
                <PanelGroup autoSaveId={"shotly-shotlist-sidebar-width"} direction="horizontal"
                            className={"PanelGroup"}>
                    <Panel defaultSize={20} maxSize={30} minSize={12} className="sidebar">
                        <div className="content">
                            <div className="top">
                                <Tooltip.Root>
                                    <Tooltip.Trigger className={"noPadding"} asChild>
                                        <Link href={`../dashboard`}>
                                            <House strokeWidth={2.5} size={20}/>
                                        </Link>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content className={"TooltipContent"}>
                                            <Tooltip.Arrow/>
                                            <p><span className="bold">Click</span> to go back to the Dashboard</p>
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                                <p>/</p>
                                <input
                                    type="text"
                                    defaultValue={shotlist.data.name || ""}
                                    placeholder={"shotlist name"}
                                    onInput={e => debounceUpdateShotlistName(e.currentTarget.value)}
                                    role={"heading"}
                                />
                            </div>
                            <div className="list" id="sceneList">
                                {!shotlist.data.scenes || shotlist.data.scenes.length == 0 ?
                                    <p className={"empty"}>No scenes yet :(</p> :
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                        onDragStart={() => {
                                            setElementIsBeingDragged(true)
                                        }}
                                        modifiers={[restrictToVerticalAxis]}
                                    >
                                        <SortableContext
                                            items={(shotlist.data?.scenes as SceneDto[]).map(scene => scene.id) as string[]}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {(shotlist.data?.scenes as SceneDto[]).map((scene: SceneDto, index) => (
                                                <Scene
                                                    key={scene.id}
                                                    scene={scene}
                                                    position={index}
                                                    expanded={selectedSceneId == scene.id}
                                                    onSelect={selectScene}
                                                    onDelete={removeScene}
                                                    readOnly={ isReadOnly }
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                }
                                <button className={"create"} disabled={isReadOnly} onClick={createScene}>Add scene <Plus/></button>
                                <div className="bottom">
                                    <button onClick={() => {
                                        setOptionsDialogOpen(true)
                                        driverObj.destroy()
                                    }} id={"shotlistOptions"}>Shotlist Options <FileSliders size={18}/></button>
                                    <button onClick={openAccountDialog}>Account <User size={18}/></button>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <Link className="shotlistTool" href={"/"}><Iconmark/>shotly.at</Link>
                        </div>
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle"/>
                    <Panel className="content" id={"shotTable"}>
                        <div className="header">
                            <div className="number"><p>#</p></div>
                            {!shotlist.data.shotAttributeDefinitions || shotlist.data.shotAttributeDefinitions.length == 0 ?
                                <p className={"empty"}>No shot attributes defined</p> :
                                (shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]).map((attr: any) => (
                                    <div key={attr.id}><p>{attr.name || "Unnamed"}</p></div>
                                ))
                            }
                        </div>
                        <ShotTable
                            ref={shotTableRef}
                            sceneId={selectedSceneId}
                            shotAttributeDefinitions={shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]}
                            readOnly={ isReadOnly }
                        />
                    </Panel>
                </PanelGroup>
            </main>
            <ShotlistOptionsDialog
                isOpen={optionsDialogOpen}
                setIsOpen={setOptionsDialogOpen}
                selectedPage={selectedOptionsDialogPage}
                shotlistId={shotlist.data.id || ""}
                refreshShotlist={() => {
                    loadData(true).then(() => {
                        setReloadKey(reloadKey + 1)
                    })
                }}
            ></ShotlistOptionsDialog>
            {AccountDialog}
        </ShotlistContext.Provider>
    )
}