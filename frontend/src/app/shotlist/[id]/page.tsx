import {query} from "@/ApolloClient"
import gql from "graphql-tag"

export default async function Page(
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
  const { id } = await params
  const { data } = await query({ query: gql`
    query shotlist($id: String!){
      shotlist(id: $id){
        id
        name
        scenes{
          id
          number
          attributes{
            id
            definition{type, name, position}
            
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
              definition{type, name, position}
              
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
    variables: { id: id }
  });

  console.log(data)

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