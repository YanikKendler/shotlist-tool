import React from "react"
import "./legal.scss"
import Wordmark from "@/components/wordmark"
import Link from "next/link"

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <main className="legal">
            <Link href={"/"}><Wordmark/></Link>
            {children}
        </main>
    )
}