import React from "react"
import "./loadingPage.scss"
import Loader from "@/components/loader/loader"

export default function LoadingPage({text}: { text?: string }) {
    return (
        <div className="loadingPage">
            <Loader text={text}/>
        </div>
    )
}