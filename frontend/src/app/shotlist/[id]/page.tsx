'use client'

import gql from "graphql-tag"
import {use} from "react"
import {useQuery} from "@apollo/client"
import {SceneAttributeParser} from "@/util/AttributeParser"
import Scene from "@/components/scene"

export default function Shotlist(
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
  const { id } = use(params)
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
          shots{
            id
            number
            attributes{
              id
              definition{name, position}
              
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
        }
        sceneAttributeDefinitions{
          name
          position
        }
        shotAttributeDefinitions{
          name
          position
        }
      }
    }`,
    { variables: {id: id} }
  )

  console.log(data)

  if(loading) return <div>loading..</div>
  if(error) return <div>error: {error.name}, message: {error.message}</div>

  return(
    <div>
      <p>{data.shotlist.name}</p>
      {data.shotlist.scenes.map((scene) => (
        <Scene key={scene.id} scene={scene}/>
      ))}
    </div>
  )
}