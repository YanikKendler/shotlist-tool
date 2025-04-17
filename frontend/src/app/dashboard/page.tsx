'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useQuery, useSuspenseQuery} from "@apollo/client"

export default function Dashboard() {
  const { error, loading, data } = useQuery(gql`
    query shotlists {
        shotlists{
          id
          name
        }
    }`);

    if(loading) return <div>loading..</div>
    if(error) return <div>error: {error.name}, message: {error.message}</div>

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
