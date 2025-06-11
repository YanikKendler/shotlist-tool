'use client'

import "./errorPage.scss"
import React from "react"
import Link from "next/link"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import Utils from "@/util/Utils"

export interface ErrorPageSettings {
    title: string
    description: string
    link: {
        text: string
        href: string
    }
}

export default function ErrorPage({settings}: {settings: ErrorPageSettings}) {
    if(!settings || !settings.link) return <LoadingPage/>
    return (
        <div className={"errorPage"}>
            <div className="content">
                <span className="smiley">:(</span>
                <div className="main">
                    <h1 style={{fontSize: Utils.clampFontSizeByTextLength(settings.title, {length: 10, fontSize: 4*16}, {length: 25, fontSize: 2*16})}}>{settings.title}</h1>
                    <p className={"description"}>{settings.description}</p>
                    <Link className={"solid"} href={settings.link.href}>{settings.link.text}</Link>
                </div>
            </div>
        </div>
    );
}
