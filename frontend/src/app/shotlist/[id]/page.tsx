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
      }
    }`,
    variables: { id: id }
    });
    return <div>My Post: {data.shotlist.name}</div>
}