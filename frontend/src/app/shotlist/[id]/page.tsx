'use client'

import gql from "graphql-tag"
import React, {use, useEffect, useRef, useState} from "react"
import {useApolloClient} from "@apollo/client"
import Scene from "@/components/scene/scene"
import {
    SceneDto,
    ShotAttributeDefinitionBase,
    ShotlistDto
} from "../../../../lib/graphql/generated"
import {forbidden, useRouter, useSearchParams} from "next/navigation"
import ShotTable, {ShotTableRef} from "@/components/shotTable/shotTable"
import {FileSliders, House, Plus} from "lucide-react"
import Link from "next/link"
import './shotlist.scss'
import { ScrollArea, Tooltip } from "radix-ui"
import ErrorPage from "@/components/errorPage/errorPage"
import { ShotlistContext } from "@/context/ShotlistContext"
import ShotlistOptionsDialog from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import LoadingPage from "@/components/loadingPage/loadingPage"
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels"
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {apolloClient} from "@/ApolloWrapper"
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import auth from "@/Auth"

export default function Shotlist({params}: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const searchParams = useSearchParams()
    const sceneId = searchParams.get('sceneId')

    const [shotlist, setShotlist] = useState<{data: ShotlistDto , loading: boolean, error: any}>({data: {} as ShotlistDto, loading: true, error: null})
    const [selectedSceneId, setSelectedSceneId] = useState(sceneId || "")
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)
    const [elementIsBeingDragged, setElementIsBeingDragged] = useState(false)

    const [reloadKey, setReloadKey] = useState(0)

    const shotTableRef = useRef<ShotTableRef>(null);

    const client = useApolloClient()
    const router = useRouter()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if(!auth.isAuthenticated()){
            router.replace('/')
            return
        }

        if(!auth.getUser()) return

        loadShotlist()
    }, [id])

    const loadShotlist = async (noCache: boolean = false) => {
        const { data, errors, loading } = await client.query({query: gql`
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
                    }
                }`,
            variables: {id: id},
            fetchPolicy: noCache ? "no-cache" : "cache-first"})

        setShotlist({data: data.shotlist, loading: loading, error: errors})
    }

    const selectScene = (sceneId: string) => {
        setSelectedSceneId(sceneId)
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

        setSelectedSceneId(data.createScene.id)
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
        <ShotlistContext.Provider value={{openShotlistOptionsDialog: () => setOptionsDialogOpen(true), elementIsBeingDragged: elementIsBeingDragged, setElementIsBeingDragged: setElementIsBeingDragged}}>
            <main className="shotlist" key={reloadKey}>
                <PanelGroup autoSaveId={"shotlist-sidebar"} direction="horizontal" className={"PanelGroup"}>
                    <Panel defaultSize={20} maxSize={30} minSize={12} className="sidebar">
                        <div className="content">
                            <div className="top">
                                <Tooltip.Root>
                                    <Tooltip.Trigger className={"noPadding gripTooltipTrigger"} asChild>
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
                                <input type="text" defaultValue={shotlist.data.name || ""}/>
                            </div>
                            <div className="list">
                                { !shotlist.data.scenes || shotlist.data.scenes.length == 0 ? <p className={"empty"}>No scenes yet :(</p> :
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
                                            <Scene key={scene.id} scene={scene} position={index}
                                                   expanded={selectedSceneId == scene.id} onSelect={selectScene}
                                                   onDelete={removeScene}/>
                                        ))}
                                    </SortableContext>
                                </DndContext>
                                }
                                <button className={"create"} onClick={createScene}>Add scene <Plus/></button>
                                <div className="bottom">
                                    <button onClick={() => setOptionsDialogOpen(true)}>Shotlist Options <FileSliders size={18}/></button>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <Link className="shotlistTool" href={"../dashboard"}>shotlist.tools</Link>
                        </div>
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle"/>
                    <Panel className="content">
                        <div className="header">
                            <div className="number"><p>#</p></div>
                            {!shotlist.data.shotAttributeDefinitions || shotlist.data.shotAttributeDefinitions.length == 0 ?
                                <p className={"empty"}>No shot attributes defined</p> :
                                (shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]).map((attr: any) => (
                                    <div key={attr.id}><p>{attr.name || "Unkown"}</p></div>
                                ))
                            }
                        </div>
                        <ShotTable
                            ref={shotTableRef}
                            sceneId={selectedSceneId}
                            shotAttributeDefinitions={shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]}
                        />
                    </Panel>
                </PanelGroup>
            </main>
            <ShotlistOptionsDialog
                isOpen={optionsDialogOpen}
                setIsOpen={setOptionsDialogOpen}
                shotlistId={shotlist.data.id || ""}
                refreshShotlist={() => {
                    loadShotlist(true)
                    setReloadKey(reloadKey + 1)
                }}
            ></ShotlistOptionsDialog>
        </ShotlistContext.Provider>
    )
}