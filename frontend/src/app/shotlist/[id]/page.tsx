'use client'

import gql from "graphql-tag"
import React, {use, useState} from "react"
import {useQuery} from "@apollo/client"
import {SceneAttributeParser} from "@/util/AttributeParser"
import Scene from "@/components/scene/scene"
import {SceneDto} from "../../../../lib/graphql/generated"
import {useSearchParams} from "next/navigation"
import ShotTable from "@/components/shotTable/shotTable"
import {House, Plus} from "lucide-react"
import Link from "next/link"
import './shotlist.scss'
import { ScrollArea } from "radix-ui"

export default function Shotlist({params,}: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const searchParams = useSearchParams()
    const sceneId = searchParams.get('sceneId')

    const [selectedSceneId, setSelectedSceneId] = useState(sceneId || "")

    const { loading, error, data } = useQuery(gql`
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
        { variables: {id: id} }
    )

    const selectScene = (sceneId: string) => {
        setSelectedSceneId(sceneId)
    }

    if(loading) return <div>loading..</div>
    if(error) return <div>error: {error.name}, message: {error.message}</div>

    if(!data || !data.shotlist) return <div><p>Sorry, we could not find that Shotlist</p><Link href={`../dashboard`}>Back to Home</Link></div>

    if(selectedSceneId == "" && data.shotlist.scenes[0]?.id != undefined) setSelectedSceneId(data.shotlist.scenes[0].id)

    return (
        <main className="shotlist">
            <div className="sidebar">
                <div className="content">
                    <div className="top">
                        <Link href={`../dashboard`}><House strokeWidth={2.5}/></Link>
                        <p>/</p>
                        <input type="text" defaultValue={data.shotlist.name}/>
                    </div>
                    <div className="scenes">
                        {data.shotlist.scenes.map((scene: SceneDto) => (
                            <Scene key={scene.id} scene={scene} expanded={selectedSceneId == scene.id} onSelect={selectScene}/>
                        ))}
                        <button>New scene <Plus></Plus></button>
                    </div>
                    <div className="bottom">

                    </div>
                </div>
                <div className="bottom"></div>
            </div>
            <div className="content">
                <div className="header">
                    <div className="number"><p>#</p></div>
                    {data.shotlist.shotAttributeDefinitions.map((attr: any) => (
                        <div key={attr.id}><p>{attr.name}</p></div>
                    ))}
                </div>
                <ShotTable sceneId={selectedSceneId} shotAttributeDefinitions={data.shotlist.shotAttributeDefinitions}></ShotTable>
            </div>
        </main>
    )
}