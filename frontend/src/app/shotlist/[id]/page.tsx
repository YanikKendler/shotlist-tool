'use client'

import gql from "graphql-tag"
import React, {createContext, use, useContext, useEffect, useState} from "react"
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
import ShotTable from "@/components/shotTable/shotTable"
import {FileSliders, House, Plus} from "lucide-react"
import Link from "next/link"
import './shotlist.scss'
import { ScrollArea } from "radix-ui"
import {query} from "@/ApolloClient"
import useShotlistOptionsDialog from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import ErrorPage from "@/components/errorPage/errorPage"
import { ShotlistContext } from "@/context/ShotlistContext"
import ShotlistOptionsDialog from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"

export default function Shotlist({params}: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const searchParams = useSearchParams()
    const sceneId = searchParams.get('sceneId')

    const [shotlist, setShotlist] = useState<{data: ShotlistDto , loading: boolean, error: any}>({data: {}, loading: true, error: null})
    const [selectedSceneId, setSelectedSceneId] = useState(sceneId || "")
    const [optionsDialogOpen, setOptionsDialogOpen] = useState(false)

    const client = useApolloClient()

    useEffect(() => {
        loadShotlist()
    }, [id])

    const loadShotlist = async () => {
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
                }`, variables: {id: id}})

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

    if(shotlist.loading) return <div>loading..</div>
    if(shotlist.error) return <div>error: {shotlist.error.name}, message: {shotlist.error.message}</div>

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
            <main className="shotlist">
                <div className="sidebar">
                    <div className="content">
                        <div className="top">
                            <Link href={`../dashboard`}><House strokeWidth={2.5} size={20}/></Link>
                            <p>/</p>
                            <input type="text" defaultValue={shotlist.data.name || ""}/>
                        </div>
                        <div className="scenes">
                            {(shotlist.data?.scenes as SceneDto[]).map((scene: SceneDto, index) => (
                                <Scene key={scene.id} scene={scene} position={index} expanded={selectedSceneId == scene.id} onSelect={selectScene} onDelete={removeScene}/>
                            ))}
                            <button className={"create"} onClick={createScene}>New scene <Plus/></button>
                            <div className="bottom">
                                <button onClick={() => setOptionsDialogOpen(true)}>Shotlist Options <FileSliders size={18}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <Link className="shotlistTool" href={"../dashboard"}>shotlist.tools</Link>
                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        <div className="number"><p>#</p></div>
                        {(shotlist.data?.shotAttributeDefinitions as ShotAttributeDefinitionBase[]).map((attr: any) => (
                            <div key={attr.id}><p>{attr.name}</p></div>
                        ))}
                    </div>
                    <ShotTable sceneId={selectedSceneId} shotAttributeDefinitions={shotlist.data.shotAttributeDefinitions as ShotAttributeDefinitionBase[]}></ShotTable>
                </div>
                <ShotlistOptionsDialog
                    isOpen={optionsDialogOpen}
                    setIsOpen={setOptionsDialogOpen}
                    shotlistId={shotlist.data.id || ""}
                    refreshShotlist={loadShotlist}
                ></ShotlistOptionsDialog>
            </main>
        </ShotlistContext.Provider>
    )
}