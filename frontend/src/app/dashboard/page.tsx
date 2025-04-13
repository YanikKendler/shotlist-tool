import {query} from "@/ApolloClient"
import gql from "graphql-tag"
import Link from "next/link"

export default async function Page() {
  const { data } = await query({ query: gql`
    query shotlists {
        shotlists{
          id
          name
        }
    }`
  });

    return (
      <>
        <p>hello</p>
          {data.shotlists.map((shotlist: { id: string; name: string }) => (
            <div key={shotlist.id}>
              <Link href={`/shotlist/${shotlist.id}`}>{shotlist.name}</Link>
            </div>
          ))}
      </>
    );
}
