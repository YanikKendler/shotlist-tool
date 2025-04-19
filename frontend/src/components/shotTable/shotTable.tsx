'use client'

import {useQuery} from "@apollo/client"
import gql from "graphql-tag"
import Shot from "@/components/shot/shot"
import "./shotTable.scss"

export default function ShotTable({sceneId}: {sceneId: string}){
    const { loading, error, data } = useQuery(gql`
        query shotlist($sceneId: String!){
            shots(sceneId: $sceneId){
                id
                number
                attributes{
                    id
                    definition{id, name, position}

                    ... on ShotSingleSelectAttributeDTO{
                        singleSelectValue{name}
                    }

                    ... on ShotMultiSelectAttributeDTO{
                        multiSelectValue{name}
                    }
                    ... on ShotTextAttributeDTO{
                        textValue
                    }
                }
            }
        }`,
{ variables: {sceneId: sceneId} }
    )

    if(loading) return <div>loading..</div>
    if(error) {
        console.error(error)
        return <div>shotTable error: {error.name}, message: {error.message}</div>
    }

    return (
        <div className="shotTable">
            {data.shots.map((shot: any) => (
                <Shot shot={shot} key={shot.id}/>
            ))}
        </div>
    );
}
