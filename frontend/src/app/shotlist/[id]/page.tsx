'use client'

import gql from "graphql-tag"
import {use, useState} from "react"
import {useQuery} from "@apollo/client"
import {SceneAttributeParser} from "@/util/AttributeParser"
import Scene from "@/components/scene/scene"
import {SceneDto} from "../../../../lib/graphql/generated"
import {useSearchParams} from "next/navigation"
import ShotTable from "@/components/shotTable/shotTable"
import styles from "./styles.module.scss"

export default function Shotlist(
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }) {
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
                    number
                    attributes{
                        id
                        definition{name, position}

                        ... on SceneSingleSelectAttributeDTO{
                            singleSelectValue{name}
                        }

                        ... on SceneMultiSelectAttributeDTO{
                            multiSelectValue{name}
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

    if(loading) return <div>loading..</div>
    if(error) return <div>error: {error.name}, message: {error.message}</div>

    if(selectedSceneId == "" && data.shotlist.scenes[0]?.id != undefined) setSelectedSceneId(data.shotlist.scenes[0].id)

    console.log(data)

    return (
        <main className={styles.main}>
            <div className={styles.sidebar}>
                <p>{data.shotlist.name}</p>
                {data.shotlist.scenes.map((scene: SceneDto) => (
                    <Scene key={scene.id} scene={scene}/>
                ))}
            </div>
            <div className="content">
                <div className={styles.header}>
                    <p>#</p>
                    {data.shotlist.shotAttributeDefinitions.map((attr: any) => (
                        <p key={attr.id}>{attr.name}</p>
                    ))}
                </div>
                <ShotTable sceneId={selectedSceneId}></ShotTable>
            </div>
        </main>
    )
}