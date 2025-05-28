import React from "react"
import "./legal.scss"
import Wordmark from "@/components/wordmark"

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <main className="legal">
            <Wordmark/>
            {children}
        </main>
    )
}