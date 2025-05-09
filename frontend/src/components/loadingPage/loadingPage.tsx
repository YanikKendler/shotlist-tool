import React from "react"
import "./loadingPage.scss"
import Image from "next/image"

export default function LoadingPage() {
    return (
        <div className="loadingPage">
            <div className="content">
                <Image src={"/loadingBars.svg"} alt={"loading..."} width={60} height={75}/>
                <p>loading data</p>
            </div>
        </div>
    )
}