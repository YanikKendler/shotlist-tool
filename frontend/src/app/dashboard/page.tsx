'use client'

import gql from "graphql-tag"
import Link from "next/link"
import {useApolloClient, useQuery, useSuspenseQuery} from "@apollo/client"
import "./overview.scss"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import ErrorPage from "@/pages/errorPage/errorPage"
import {ChevronDown, House, NotepadText, Plus, User} from "lucide-react"
import {ShotlistDto} from "../../../lib/graphql/generated"
import {wuGeneral, wuTime} from "@yanikkendler/web-utils/dist"
import {useRouter} from "next/navigation"
import {useCreateShotlistDialog} from "@/components/dialog/createShotlistDialog/createShotlistDialog"
import {useAccountDialog} from "@/components/dialog/accountDialog/accountDialog"
import Utils from "@/util/Utils"

export default function Overview() {
    const [shotlists, setShotlists] = useState<{data: ShotlistDto[] , loading: boolean, error: any}>({data: [], loading: true, error: null})

    const client = useApolloClient()
    const router = useRouter()

    const { openCreateShotlistDialog, CreateShotlistDialog } = useCreateShotlistDialog()

    useEffect(() => {
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
    if(shotlists.loading) return <LoadingPage text={"loading your overview"}/>

    return (
        <main className="overview">
            <h2>Shotlists</h2>
            <div className="grid">
                {/*TODO limit to X shotlists*/}
                {shotlists.data.sort(Utils.oderShotlistsByChangeDate).map((shotlist: ShotlistDto) => (
                    <Link href={`./shotlist/${shotlist.id}`} key={shotlist.id}
                          className="gridItem shotlist">
                        <label><NotepadText size={15}/>Shotlist</label>
                        <h3>{shotlist.name || <span className='italic'>Unnamed</span>}</h3>
                        <p className={"bold"}>{shotlist.sceneCount} scene • {shotlist.shotCount} shots</p>
                        <p>created by: <span className={"bold"}>Yanik Kendler</span></p>
                        <p>last edited: <span
                            className={"bold"}>{wuTime.toRelativeTimeString(shotlist.editedAt)}</span></p>
                    </Link>
                ))}
                <button className={"gridItem add"} onClick={openCreateShotlistDialog}>
                    <span><Plus/>New Shotlist</span>
                </button>
            </div>
            {CreateShotlistDialog}
        </main>
    );
}
