import Image from "next/image"
import React from "react"
import "./loader.scss"

export default function Loader({text}: { text?: string }) {
    return (
        <div className="loader">
            <Image src={"/loadingBars.svg"} alt={"oOo"} width={60} height={75} priority={true}/>
            <p>{text || "loading.."}</p>
        </div>
    );
}