"use client"

import Auth from "@/Auth"

export default function Home() {

    return (
        <div>
            <h1>hello</h1>
            <button onClick={() => Auth.login()}>login</button>

        </div>
    );
}
