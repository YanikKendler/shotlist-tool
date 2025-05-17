import type {Metadata} from "next"
import "./globals.scss"
import React from "react"
import {ApolloWrapper} from "@/ApolloWrapper"
import SelectRefreshProvider from "@/context/SelectRefreshContext"

export const metadata: Metadata = {
    title: "Shotlist Tool",
    description: "A free and open source, no-ai, clean and simple shotlist creation tool for filmmakers"
}

import {Inter} from 'next/font/google'
import {Tooltip} from "radix-ui"
import AuthWrapper from "@/AuthWrapper"

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
        <AuthWrapper>
            <Tooltip.Provider>
                <ApolloWrapper>
                    <SelectRefreshProvider>
                        {children}
                    </SelectRefreshProvider>
                </ApolloWrapper>
            </Tooltip.Provider>
        </AuthWrapper>
        </body>
        </html>
    )
}
