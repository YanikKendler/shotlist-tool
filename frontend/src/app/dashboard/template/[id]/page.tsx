"use client"

import "./template.scss"
import {useParams, useSearchParams} from "next/navigation"
import {useApolloClient} from "@apollo/client"
import ErrorPage from "@/pages/errorPage/errorPage"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import {ShotlistDto, TemplateDto} from "../../../../../lib/graphql/generated"
import gql from "graphql-tag"
import {wuGeneral} from "@yanikkendler/web-utils/dist"
import {Pen, Pencil, Plus} from "lucide-react"
import Input from "@/components/input/input"

export default function Template (){
    const params = useParams<{ id: string }>()
    const id = params?.id || ""

    const [template, setTemplate] = useState<{data: TemplateDto, loading: boolean, error: any}>({data: {} as TemplateDto, loading: true, error: null})

    const client = useApolloClient()

    useEffect(() => {
        if(!id || id.length !== 36)
            setTemplate({data: {} as TemplateDto, loading: false, error: new Error("Invalid template ID")})
        else
            loadTemplate()
    }, []);

    const loadTemplate = async (noCache: boolean = false) => {
        try{
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
        }catch (e){
            console.error(e)
            setTemplate({data: {} as TemplateDto, loading: false, error: e})
        }
    }

    const updateTemplateName = async (name: string) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation updateTemplate($templateId: String!, $name: String!) {
                    updateTemplate(editDTO: {
                        id: $templateId
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { templateId: id, name: name },
        });

        if (errors) {
            console.error(errors);
            return;
        }
    }

    const handleTemplateNameChange = (name: string) => {
        setTemplate({
            ...template,
            data: {
                ...template.data,
                name: name
            }
        })

        debounceUpdateTemplateName(name)
    }

    const debounceUpdateTemplateName = wuGeneral.debounce(updateTemplateName)

    if(template.error) return <main className={"dashboardContent"}><ErrorPage settings={{
        title: 'Data could not be loaded',
        description: template.error.message,
        link: {
            text: 'Dashboard',
            href: '/dashboard'
        }
    }}/></main>

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
            <h2>
                <Input
                    value={template.data.name || ""}
                    placeholder={"template name"}
                    valueChange={handleTemplateNameChange}
                    inputClass={"templateName"}
                    maxLength={80}
                    maxWidth={"90ch"}
                    showError={false}
                />
                <div className="spacerContainer">
                    <p className="spacer">{template.data.name}</p>
                    <Pencil size={18} style={{display: template.data.name == "" ? "none" : "block"}}/>
                </div>
            </h2>
            <h3>Shot Attributes</h3>
            {
                !template.data.shotAttributes || template.data.shotAttributes?.length <= 0 ?
                <p className={"empty"}>Nothing here yet</p> :
                template.data.shotAttributes.map(attr => (
                    <p>attr</p>
                ))
            }
            <button className="add">Add Shot Attribute <Plus size={20}/></button>
            <h3>Scene Attributes</h3>
            <button className="add">Add Scene Attribute <Plus size={20}/></button>
        </main>
    )
}