'use client'

import "./errorPage.scss"
import React from "react"
import Link from "next/link"

export interface ErrorPageSettings {
    title: string
    description: string
    link: {
        text: string
        href: string
    }
}

export default function ErrorPage({settings}: {settings: ErrorPageSettings}) {
    return (
        <div className={"errorPage"}>
            <div className="content">
                <h1>{settings.title}</h1>
                <p className={"description"}>{settings.description}</p>
                <Link className={"solid"} href={settings.link.href}>{settings.link.text}</Link>
                <span className="smiley">:(</span>
            </div>
        </div>
    );
}
