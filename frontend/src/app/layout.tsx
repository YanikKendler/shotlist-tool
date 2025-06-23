import type {Metadata} from "next"
import "./globals.scss"
import React from "react"
import {ApolloWrapper} from "@/ApolloWrapper"
import SelectRefreshProvider from "@/context/SelectRefreshContext"

export const metadata: Metadata = {
    title: "Shotly | Shotlist creation made easy",
    description: "A free and open source, no-ai, clean and simple shotlist creation tool for filmmakers"
}

import {Inter} from 'next/font/google'
import {Toast, Tooltip} from "radix-ui"
import AuthWrapper from "@/AuthWrapper"
import {useNotification} from "@/components/notification/notification"
import NotificationWrapper from "@/NotificationWrapper"
import {Config} from "@/util/Utils"

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
        <head>
            {/*set the theme attribute (dark or light) based on the user preference (dark light or system)*/}
            <script dangerouslySetInnerHTML={{__html: `(() => {
                let userPreference = localStorage.getItem('shotly-theme') || 'system';
                if (userPreference === 'system') {
                    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', systemPref);
                } else {
                    document.documentElement.setAttribute('data-theme', userPreference);
                }
            })()`}}/>
        </head>
        <body>
        <Toast.Provider>
            <div className="root">
                {Config.mode === "dev-deployment" && <div className="infoBanner">You are currently viewing a dev deployment</div>}
                <AuthWrapper data-test={"AuthWrapper"}>
                    <ApolloWrapper data-test={"ApolloWrapper"}>
                        <NotificationWrapper data-test={"NotificationWrapper"}>
                            <Tooltip.Provider data-test={"Tooltip.Provider"}>
                                <SelectRefreshProvider data-test={"SelectRefreshProvider"}>
                                    {children}
                                </SelectRefreshProvider>
                            </Tooltip.Provider>
                        </NotificationWrapper>
                    </ApolloWrapper>
                </AuthWrapper>
            </div>
            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
        </body>
        </html>
    )
}
