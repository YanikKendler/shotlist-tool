"use client"

import Auth from "@/Auth"
import "./home.scss"
import Link from "next/link"
import Wordmark from "@/components/wordmark"
import React from "react"
import {BookText, Columns3Cog, Download, FileCode, Users} from "lucide-react"
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
                    <button className={"accent"} onClick={() => Auth.login()}>Get started for free</button>
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
            <section className="features" id={"features"}>
                <div className="content">
                    <div className="feature">
                        <div className="icon">
                            <Columns3Cog size={40}/>
                        </div>
                        <h2>Customizable</h2>
                        <p>Select which attributes you want per shot and per scene.</p>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <FileCode size={40}/>
                        </div>
                        <h2>Open Source</h2>
                        <p>Self host your shotlists, add your own features or improve shotly.</p>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <Users size={40}/>
                        </div>
                        <h2>Live Collaboration</h2>
                        <p>Share your shotlist with colleagues and create together.</p>
                    </div>
                    <div className="feature">
                        <div className="icon">
                            <Download size={40}/>
                        </div>
                        <h2>Easy Export</h2>
                        <p>Export to PDF/CSV for print or distribution. Use filters to get only what you need.</p>
                    </div>
                </div>
            </section>
            <section className="pricing">

            </section>
            <footer>
                <div className={"credits"}>
                    <Wordmark/>
                    <p className={"createdBy"}>created with ♥ by <Link href={"https://yanik.kendler.me"} target={"_blank"} className={"noPadding"}>Yanik Kendler</Link></p>
                    <Link className={"noPadding"} href={"https://github.com/YanikKendler/shotlist-tool"} target={"_blank"}>github.com/YanikKendler/shotlist-tool</Link>
                    <p className={"copyright"}>© 2025 Yanik Kendler. Open source under the MIT License.</p>
                </div>
                <div>
                    <h3>Legal</h3>
                    <Link className={"noPadding"} href={"./legal/cookies"}>cookies</Link>
                    <Link className={"noPadding"} href={"./legal/privacy"}>privacy</Link>
                    <Link className={"noPadding"} href={"./legal/legalNotice"}>legal notice</Link>
                    <Link className={"noPadding"} href={"./legal/termsOfUse"}>terms of use</Link>
                </div>

                <div>
                    <h3>Support</h3>
                    <Link className={"noPadding"} href={"/"}>Documentation</Link>
                    <Link className={"noPadding"} href={"https://github.com/YanikKendler/shotlist-tool/issues/new/choose"}>Report a Bug</Link>
                    <Link className={"noPadding"} href={"https://github.com/YanikKendler/shotlist-tool/issues/new/choose"}>Suggest a Feature</Link>
                </div>
            </footer>
        </main>
    );
}
