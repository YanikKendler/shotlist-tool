'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useApolloClient, useQuery, useSuspenseQuery} from "@apollo/client"
import "./dashboard.scss"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import ErrorPage from "@/pages/errorPage/errorPage"
import {ChevronDown, House, NotepadText, NotepadTextDashed, Plus, User} from "lucide-react"
import {ShotlistDto, TemplateDto} from "../../../lib/graphql/generated"
import {wuGeneral, wuTime} from "@yanikkendler/web-utils/dist"
import {useRouter} from "next/navigation"
import {useCreateShotlistDialog} from "@/components/dialog/createShotlistDialog/createShotlistDialog"
import {useAccountDialog} from "@/components/dialog/accountDialog/accountDialog"
import Utils from "@/util/Utils"
import {useCreateTemplateDialog} from "@/components/dialog/createTemplateDialog/createTemplateDialog"
import auth from "@/Auth"

export default function Overview() {
    const [query, setQuery] = useState<{ error: any, loading: boolean }>({error: null, loading: true})

    const [shotlists, setShotlists] = useState<ShotlistDto[]>([])
    const [templates, setTemplates] = useState<TemplateDto[]>([])

    const client = useApolloClient()

    const { openCreateShotlistDialog, CreateShotlistDialog } = useCreateShotlistDialog()
    const { openCreateTemplateDialog, CreateTemplateDialog } = useCreateTemplateDialog()

    useEffect(() => {
        loadData()
    }, []);

    const loadData = async () => {
        const { data, error, loading } = await client.query({query: gql`
                query dashboard{
                    shotlists{
                        id
                        name
                        sceneCount
                        shotCount
                        editedAt
                        owner {
                            name
                        }
                    }
                    templates {
                        id
                        name
                        shotAttributeCount
                        sceneAttributeCount
                        owner {
                            name
                        }
                    }
                }`,
            fetchPolicy: "no-cache"
        })

        console.log(data)

        setQuery({error, loading})

        setShotlists(data.shotlists)
        setTemplates(data.templates)
    }

    if(query.error) return <ErrorPage settings={{
        title: 'Data could not be loaded',
        description: query.error.message,
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>
    if(query.loading) return <LoadingPage text={"loading your overview"}/>

    return (
        <main className="overview dashboardContent">
            <h2>Shotlists</h2>
            <div className="grid">
                {shotlists.sort(Utils.oderShotlistsOrTemplatesByChangeDate).map((shotlist: ShotlistDto) => (
                    <Link href={`/shotlist/${shotlist.id}`} key={shotlist.id} className="gridItem shotlist">
                        <label><NotepadText size={15}/>Shotlist</label>
                        <h3>{shotlist.name || <span className='italic'>Unnamed</span>}</h3>
                        <p className={"bold"}>{shotlist.sceneCount} scene • {shotlist.shotCount} shots</p>
                        <p>created by: <span className={"bold"}>{shotlist.owner?.name}</span></p>
                        <p>last edited: <span
                            className={"bold"}>{wuTime.toRelativeTimeString(shotlist.editedAt)}</span></p>
                    </Link>
                ))}
                <button className={"gridItem add"} onClick={openCreateShotlistDialog}>
                    <span><Plus/>New Shotlist</span>
                </button>
            </div>
            <h2>Templates</h2>
            <div className="grid">
                {templates.sort(Utils.oderShotlistsOrTemplatesByChangeDate).map((template: TemplateDto) => (
                    <Link href={`dashboard/template/${template.id}`} key={template.id} className="gridItem template">
                        <label><NotepadTextDashed size={15}/>Template</label>
                        <h3>{template.name || <span className='italic'>Unnamed</span>}</h3>
                        <p>Shots: <span className={"bold"}>{template.shotAttributeCount} Attributes</span></p>
                        <p>Scenes: <span className={"bold"}>{template.sceneAttributeCount} Attributes</span></p>
                        <p>created by: <span className={"bold"}>{template.owner?.name}</span></p>
                    </Link>
                ))}
                <button className={"gridItem add"} onClick={openCreateTemplateDialog}>
                    <span><Plus/>New Template</span>
                </button>
            </div>
            {CreateShotlistDialog}
            {CreateTemplateDialog}
        </main>
    );
}
