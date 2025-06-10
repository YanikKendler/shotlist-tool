"use client"

import "./template.scss"
import {useParams, useSearchParams} from "next/navigation"
import {useApolloClient} from "@apollo/client"
import ErrorPage from "@/pages/errorPage/errorPage"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import {ShotlistDto, TemplateDto} from "../../../../../lib/graphql/generated"
import gql from "graphql-tag"

export default function Template (){
    const params = useParams<{ id: string }>()
    const id = params?.id || ""

    const [template, setTemplate] = useState<{data: TemplateDto , loading: boolean, error: any}>({data: {} as TemplateDto, loading: true, error: null})

    const client = useApolloClient()

    useEffect(() => {
        loadTemplate()
    }, []);

    const loadTemplate = async (noCache: boolean = false) => {
        const { data, errors, loading } = await client.query({query: gql`
                query template($id: String!){
                    template(id: $id) {
                        id
                        name
                        sceneAttributes {
                            id
                            name
                            position
                            __typename
                        }
                        shotAttributes {
                            id
                            name
                            position
                            __typename
                        }
                    }
                }`,
            variables: {id: id},
            fetchPolicy: noCache ? "no-cache" : "cache-first"})

        console.log(data.template)

        setTemplate({data: data.template, loading: loading, error: errors})
    }

    if(template.error) return <ErrorPage settings={{
        title: 'Data could not be loaded',
        description: template.error.message,
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>

    if(template.loading) return <LoadingPage text={"loading template"}/>

    if(!template.data) return <main className={"dashboardContent"}><ErrorPage settings={{
        title: '404',
        description: 'Sorry, we could not find the template you were looking for. Please check the URL or return to the dashboard.',
        link: {
            text: 'Dashboard',
            href: '/dashboard'
        }
    }}/></main>

    return (
        <main className={"template dashboardContent"}>
            <h2>{template.data.name}</h2>
            <h3>Shot Attributes</h3>
            <h3>Scene Attributes</h3>
        </main>
    )
}