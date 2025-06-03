import type {Metadata} from "next"
import "./globals.scss"
import React from "react"
import {ApolloWrapper} from "@/ApolloWrapper"
import SelectRefreshProvider from "@/context/SelectRefreshContext"

export const metadata: Metadata = {
    title: "Shotly | Free and Open Source Shotlist creation",
    description: "A free and open source, no-ai, clean and simple shotlist creation tool for filmmakers"
}

import {Inter} from 'next/font/google'
import {Toast, Tooltip} from "radix-ui"
import AuthWrapper from "@/AuthWrapper"
import {useNotification} from "@/components/notification/notification"
import NotificationWrapper from "@/NotificationWrapper"

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={inter.className}>
        <body>
        <Toast.Provider>
            <div className="rootStack">
                <AuthWrapper>
                    <ApolloWrapper>
                        <NotificationWrapper>
                            <Tooltip.Provider>
                                <SelectRefreshProvider>
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
