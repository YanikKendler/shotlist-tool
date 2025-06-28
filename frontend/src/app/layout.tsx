import "./globals.scss"
import React from "react"
import {ApolloWrapper} from "@/ApolloWrapper"
import SelectRefreshProvider from "@/context/SelectRefreshContext"

export const metadata = {
    title: "Shotly | Shotlist creation made easy",
    description:
        "A freemium, open source, no-AI, clean and simple shotlist creation tool for filmmakers.",
    keywords: [
        "shotlist",
        "shotlist creation",
        "film shotlist",
        "video shotlist",
        "film production",
        "video production",
        "pre-production",
        "production planning",
        "film planning",
        "shoot planning",
        "storyboarding",
        "cinematography",
        "cinematographer tools",
        "director tools",
        "filmmaking tools",
        "production tools",
        "film crew collaboration",
        "open source filmmaking",
        "no AI filmmaking",
        "film production software",
        "video production software",
        "film production planning",
        "script breakdown",
        "film project management",
        "digital shotlist",
        "freemium filmmaking software",
        "clean shotlist app",
        "simple shotlist app",
        "shotlist template",
        "camera shot planning"
    ],
    metadataBase: new URL("https://shotly.at"),
    openGraph: {
        title: "Shotly | Shotlist creation made easy",
        description:
            "A freemium, open source, no-AI, clean and simple shotlist creation tool for filmmakers.",
        url: "https://shotly.at",
        siteName: "Shotly",
        images: [
            {
                url: "https://shotly.at/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Shotly - Shotlist Creation Tool"
            }
        ],
        locale: "en_US",
        type: "website"
    },
    twitter: {
        card: "summary_large_image",
        title: "Shotly | Shotlist creation made easy",
        description:
            "Create clean, professional shotlists with Shotly. Open source and no AI.",
        images: ["https://shotly.at/og-image.jpg"],
    },
    authors: [{ name: "Yanik Kendler", url: "https://yanik.kendler.me" }],
    creator: "Yanik Kendler",
    publisher: "Shotly",
    themeColor: "#F04800",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png"
    }
};


import {Inter} from 'next/font/google'
import {Toast, Tooltip} from "radix-ui"
import AuthWrapper from "@/AuthWrapper"
import {useNotification} from "@/components/notification/notification"
import NotificationWrapper from "@/NotificationWrapper"
import {Config} from "@/util/Utils"
import Head from "next/head"

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
        <head>{/*has to be native "head" not nextJS "Head" or the darkmode query won't be run*/}
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
