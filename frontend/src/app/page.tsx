"use client"

import Auth from "@/Auth"
import "./home.scss"
import Link from "next/link"
import Wordmark from "@/components/wordmark"
import React from "react"
import {BookText} from "lucide-react"
import Image from "next/image"

export default function Home() {

    return (
        <main className="home">
            <nav>
                <div className="left">
                    <Link href={"/"} className={"noPadding"}><BookText size={22} />Documentation</Link>
                </div>
                <div className="center">
                    <Link href={"#hero"}>Home</Link>
                    <Link href={"#features"}>Features</Link>
                    <Link href={"#pricing"}>Pricing</Link>
                </div>
                <div className="right">
                    <Link href={"/dashboard"}>Your Dashboard</Link>
                </div>
            </nav>
            <section className="hero" id={"hero"}>
                <div className="center">
                    <Wordmark/>
                    <p className={"tagline"}>Shotlist creation made easy!</p>
                    <button className={"accent"}>Get started for free</button>
                    <div className="beta">Beta</div>
                </div>
                <Image id={"clapboard"} src={"/home-doodles/doodle-0.svg"} alt={"doodle"} width={128} height={118} fetchPriority={"low"}/>
                <Image id={"brush"} src={"/home-doodles/doodle-1.svg"} alt={"doodle"} width={97} height={85} fetchPriority={"low"}/>
                <Image id={"shotlist"} src={"/home-doodles/doodle-2.svg"} alt={"doodle"} width={179} height={111} fetchPriority={"low"}/>
                <Image id={"close-up"} src={"/home-doodles/doodle-3.svg"} alt={"doodle"} width={118} height={52} fetchPriority={"low"}/>
                <Image id={"clipboard"} src={"/home-doodles/doodle-4.svg"} alt={"doodle"} width={85} height={113} fetchPriority={"low"}/>
                <Image id={"medium-shot"} src={"/home-doodles/doodle-5.svg"} alt={"doodle"} width={126} height={37} fetchPriority={"low"}/>
                <Image id={"thoughts"} src={"/home-doodles/doodle-6.svg"} alt={"doodle"} width={59} height={52} fetchPriority={"low"}/>
                <Image id={"camera"} src={"/home-doodles/doodle-7.svg"} alt={"doodle"} width={120} height={94} fetchPriority={"low"}/>
            </section>
            <div className="content">
                <p className="mainText">
                    This is an early alpha version of my shotlist creation tool. Log in to get started!
                </p>
                <button onClick={() => Auth.login()}>Log in</button>

                <p className="bottomText">
                    Be aware that multiple features are still missing. If you find any bugs or have suggestions, please
                    report them on <Link href="https://github.com/elYanuki/shotlist-tool/issues/new/choose" target={"_blank"}> the GitHub page</Link>.
                    Thank you! :)
                    Since this is an alpha release, I do NOT guarantee the safety of your data at this time.
                </p>

            </div>
            <footer>
                <div className="legal">
                    <Link href={"./legal/cookies"}>cookies</Link>
                    <Link href={"./legal/privacy"}>privacy</Link>
                    <Link href={"./legal/legalNotice"}>legal notice</Link>
                    <Link href={"./legal/termsOfUse"}>terms of use</Link>
                </div>
            </footer>
        </main>
    );
}
