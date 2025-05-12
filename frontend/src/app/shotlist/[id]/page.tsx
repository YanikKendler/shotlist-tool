'use client'

import gql from "graphql-tag"
import React, {createContext, use, useContext, useEffect, useRef, useState} from "react"
import {useApolloClient, useQuery} from "@apollo/client"
import {SceneAttributeParser} from "@/util/AttributeParser"
import Scene from "@/components/scene/scene"
import {
    SceneAttributeDefinitionBase,
    SceneDto,
    ShotAttributeDefinitionBase,
    ShotlistDto
} from "../../../../lib/graphql/generated"
import {useSearchParams} from "next/navigation"
import ShotTable, {ShotTableRef} from "@/components/shotTable/shotTable"
import {FileSliders, House, Plus} from "lucide-react"
import Link from "next/link"
import './shotlist.scss'
import { ScrollArea } from "radix-ui"
import {query} from "@/ApolloClient"
import useShotlistOptionsDialog from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import ErrorPage from "@/components/errorPage/errorPage"
import { ShotlistContext } from "@/context/ShotlistContext"
import ShotlistOptionsDialog from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import shotTable from "@/components/shotTable/shotTable"
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

export default function Shotlist({params}: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const searchParams = useSearchParams()
    const sceneId = searchParams.get('sceneId')

    const [shotlist, setShotlist] = useState<{data: ShotlistDto , loading: boolean, error: any}>({data: {}, loading: true, error: null})
    const [selectedSceneId, setSelectedSceneId] = useState(sceneId || "")
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)

    const [reloadKey, setReloadKey] = useState(0)

    const shotTableRef = useRef<ShotTableRef>(null);

    const client = useApolloClient()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
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
    if(shotlist.loading) return <LoadingPage/>

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
        <ShotlistContext.Provider value={{openShotlistOptionsDialog: () => setOptionsDialogOpen(true)}}>
            <main className="shotlist" key={reloadKey}>
                <PanelGroup autoSaveId={id} direction="horizontal" className={"PanelGroup"}>
                    <Panel defaultSize={20} maxSize={30} minSize={12} className="sidebar">
                        <div className="content">
                            <div className="top">
                                <Link href={`../dashboard`}><House strokeWidth={2.5} size={20}/></Link>
                                <p>/</p>
                                <input type="text" defaultValue={shotlist.data.name || ""}/>
                            </div>
                            <div className="scenes">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToVerticalAxis]}
                                >
                                    <SortableContext
                                        items={(shotlist.data?.scenes as SceneDto[]).map(scene => scene.id) as string[]}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {(shotlist.data?.scenes as SceneDto[]).map((scene: SceneDto, index) => (
                                            <Scene key={scene.id} scene={scene} position={index} expanded={selectedSceneId == scene.id} onSelect={selectScene} onDelete={removeScene}/>
                                        ))}
                                    </SortableContext>
                                </DndContext>
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
                            {(shotlist.data?.shotAttributeDefinitions as ShotAttributeDefinitionBase[]).map((attr: any) => (
                                <div key={attr.id}><p>{attr.name || "Unkown"}</p></div>
                            ))}
                        </div>
                        <ShotTable ref={shotTableRef} sceneId={selectedSceneId} shotAttributeDefinitions={shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]}></ShotTable>
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