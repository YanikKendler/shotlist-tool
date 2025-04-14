'use client'

import gql from "graphql-tag"
import {use} from "react"
import {useQuery} from "@apollo/client"

export default function Page(
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
      {data.shotlist.scenes.map((scene: { id: string; number: string; attributes: any[] }) => (
        <div key={scene.id}>
          <p>{scene.number+1}</p>
          <p>{scene.attributes.map(attr => attr.definition.name).join(" • ")}</p>
        </div>
      ))}
    </div>
  )
}