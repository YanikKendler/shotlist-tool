'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useApolloClient, useQuery, useSuspenseQuery} from "@apollo/client"
import "./dashboard.scss"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import ErrorPage from "@/pages/errorPage/errorPage"
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels"
import {ChevronDown, House, NotepadText, Plus, User} from "lucide-react"
import {ShotlistDto} from "../../../lib/graphql/generated"
import {Collapsible, Separator, Tooltip} from "radix-ui"
import {wuGeneral, wuTime} from "@yanikkendler/web-utils/dist"
import auth from "@/Auth"
import {useRouter} from "next/navigation"
import {useCreateShotlistDialog} from "@/components/dialog/createShotlistDialog/createShotlistDialog"
import {useAccountDialog} from "@/components/dialog/accountDialog/accountDialog"
import Utils from "@/util/Utils"
import Image from "next/image"
import Iconmark from "@/components/iconmark"

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    const [shotlists, setShotlists] = useState<{data: ShotlistDto[] , loading: boolean, error: any}>({data: [], loading: true, error: null})

    const client = useApolloClient()
    const router = useRouter()

    const { openCreateShotlistDialog, CreateShotlistDialog } = useCreateShotlistDialog()
    const { openAccountDialog, AccountDialog } = useAccountDialog()

    useEffect(() => {
        if(!auth.isAuthenticated()){
            router.replace('/')
            return
        }

        if(!auth.getUser()) return

        loadShotlists()
    }, []);

    const loadShotlists = async (noCache: boolean = true) => {
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
    if(shotlists.loading) return <LoadingPage text={"loading your dashboard"}/>

    return (
        <main className="dashboard">
            <p className="noMobile">Sorry, mobile mode is not supported yet since this is a alpha test. An acceptable mobile version will be available in the full release.</p>
            <PanelGroup autoSaveId={"shotly-dashboard-sidebar-width"} direction="horizontal" className={"PanelGroup"}>
                <Panel defaultSize={20} maxSize={30} minSize={12} className="sidebar">
                    <div className="content">
                        <div className="top">
                            <Tooltip.Root>
                                <Tooltip.Trigger className={"noPadding gripTooltipTrigger"} asChild>
                                    <Link href={`../dashboard`} onClick={e => {
                                        wuGeneral.onNthClick(() => {
                                            console.log("forward")
                                            window.open("https://orteil.dashnet.org/cookieclicker", '_blank')?.focus()
                                        }, e.nativeEvent, 10)
                                    }}>
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
                                    My Shotlists <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    {
                                        shotlists.data.length === 0 ? (
                                                <button onClick={openCreateShotlistDialog} className={"empty"}>Start
                                                    by <span>creating a new shotlist</span> :)</button>) :
                                            shotlists.data.sort(Utils.orderShotlistsByName).map((shotlist) => (
                                                <Link key={shotlist.id} href={`../shotlist/${shotlist.id}`}>
                                                    <NotepadText size={18}/>
                                                    {shotlist.name ? <span className={"wrap"}>{shotlist.name}</span> : (<span className={"italic"}>Unnamed</span>)}
                                                </Link>
                                            ))
                                    }
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={false}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    Shared Shotlists <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p className={"empty"}>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <Separator.Separator decorative orientation="horizontal" className={"Separator"}/>

                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={false}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    My Templates <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p className={"empty"}>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>
                            <Collapsible.Root className={"CollapsibleRoot dashboardSidebar"} defaultOpen={false}>
                                <Collapsible.Trigger className={"noClickFx"}>
                                    Shared Templates <ChevronDown size={18} className={"chevron"}/>
                                </Collapsible.Trigger>
                                <Collapsible.Content
                                    className="CollapsibleContent dashboardSidebar"
                                >
                                    <p className={"empty"}>work in progress</p>
                                </Collapsible.Content>
                            </Collapsible.Root>

                            <div className="bottom">
                                <button onClick={openAccountDialog}>Account <User size={18}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <Link className="shotlistTool" href={"/"}><Iconmark/>shotly.at</Link>
                    </div>
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle"/>
                <Panel className="content">
                    <div className="header">
                        {/*<button className="template" disabled>new template</button>*/}
                        <button className="shotlist" onClick={openCreateShotlistDialog}>New Shotlist</button>
                    </div>
                    {children}
                </Panel>
            </PanelGroup>

            {CreateShotlistDialog}
            {AccountDialog}
        </main>
    );
}
