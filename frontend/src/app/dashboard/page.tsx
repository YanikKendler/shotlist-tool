'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useApolloClient, useQuery, useSuspenseQuery} from "@apollo/client"
import "./dashboard.scss"
import LoadingPage from "@/components/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import ErrorPage from "@/components/errorPage/errorPage"
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels"
import {ChevronDown, House, NotepadText, Plus, User} from "lucide-react"
import {ShotlistDto} from "../../../lib/graphql/generated"
import {Collapsible, Separator, Tooltip} from "radix-ui"
import {wuTime} from "@yanikkendler/web-utils/dist"
import auth from "@/Auth"

export default function Dashboard() {
    const [shotlists, setShotlists] = useState<{data: ShotlistDto[] , loading: boolean, error: any}>({data: [], loading: true, error: null})
    const [accountDialogOpen, setAccountDialogOpen] = useState(false)

    const client = useApolloClient()

    useEffect(() => {
        console.log(auth.getIdToken())
        loadShotlists()
    }, []);

    const loadShotlists = async (noCache: boolean = false) => {
        const { data, errors, loading } = await client.query({query: gql`
                query shotlists{
                    shotlists{
                        id
                        name
                        sceneCount
                        shotCount
                        editedAt
                    }
                }`,
            fetchPolicy: noCache ? "no-cache" : "cache-first"})

        setShotlists({data: data.shotlists, loading: loading, error: errors})
    }

    if(shotlists.error) return <ErrorPage settings={{
        title: 'Data could not be loaded',
        description: shotlists.error.message,
        link: {
            text: 'Dashboard',
            href: '../dashboard'
        }
    }}/>
    if(shotlists.loading) return <LoadingPage/>

    return (
        <main className="dashboard">
            <PanelGroup autoSaveId={"dashboard-sidebar"} direction="horizontal" className={"PanelGroup"}>
                <Panel defaultSize={20} maxSize={30} minSize={12} className="sidebar">
                    <div className="content">
                        <div className="top">
                            <Tooltip.Root>
                                <Tooltip.Trigger className={"noPadding gripTooltipTrigger"} asChild>
                                    <Link href={`../dashboard`}>
                                        <House strokeWidth={2.5} size={20}/>
                                    </Link>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content className={"TooltipContent"}>
                                        <Tooltip.Arrow/>
                                        <p><span className="bold">Click</span> to go back to the Dashboard</p>
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                            <p>/</p>
                            <h1>Dashboard</h1>
                        </div>
                        <div className="list">
                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={true}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    my shotlists <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    {shotlists.data.map((shotlist) => (
                                        <Link key={shotlist.id} href={`../shotlist/${shotlist.id}`}>
                                            <NotepadText size={18}/>
                                            {shotlist.name}
                                        </Link>
                                    ))}
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={false}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    shared shotlists <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <Separator.Separator decorative orientation="horizontal" className={"Separator"}/>

                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={true}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    my templates <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>
                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={true}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    shared templates <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <div className="bottom">
                                <button onClick={() => setAccountDialogOpen(true)}>Account <User size={18}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <Link className="shotlistTool" href={"../dashboard"}>shotlist.tools</Link>
                    </div>
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle"/>
                <Panel className="content">
                    <div className="header">
                        <button className="template" disabled>new template</button>
                        <button className="shotlist">new shotlist</button>
                    </div>
                    <div className="main">
                        <div className="grid">
                            {/*TODO limit to 8 shotlists and filter by last edited*/}
                            {shotlists.data.map((shotlist: ShotlistDto) => (
                                <Link href={`./shotlist/${shotlist.id}`} key={shotlist.id} className="gridItem shotlist">
                                    <label><NotepadText size={15}/>Shotlist</label>
                                    <h2>{shotlist.name}</h2>
                                    <p className={"bold"}>{shotlist.sceneCount} scene • {shotlist.shotCount} shots</p>
                                    <p>created by: <span className={"bold"}>Yanik Kendler</span></p>
                                    <p>last edited: <span className={"bold"}>{wuTime.toRelativeTimeString(shotlist.editedAt)}</span></p>
                                </Link>
                            ))}
                            <button className={"gridItem add"}>
                                <span><Plus/>new shotlist</span>
                            </button>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </main>
    );
}
