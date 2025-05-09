'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useQuery, useSuspenseQuery} from "@apollo/client"
import "./dashboard.scss"
import LoadingPage from "@/components/loadingPage/loadingPage"
import React from "react"
import ErrorPage from "@/components/errorPage/errorPage"

export default function Dashboard() {
  const { error, loading, data } = useQuery(gql`
    query shotlists {
        shotlists{
          id
          name
        }
    }`);

    if(error) return <ErrorPage settings={{
        title: 'Data could not be loaded',
        description: error.message,
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>
    if(loading) return <LoadingPage/>

    return (
      <main className="dashboard">
        <p>hello</p>
        {data.shotlists.map((shotlist: { id: string; name: string }) => (
          <div key={shotlist.id}>
            <Link href={`/shotlist/${shotlist.id}`}>{shotlist.name}</Link>
          </div>
        ))}
      </main>
    );
}
