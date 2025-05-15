"use client"

import Auth from "@/Auth"

export default function Home() {

    return (
        <div>
            <h1>hello</h1>
            <button onClick={() => Auth.login()}>login</button>
            <button onClick={() => {
                fetch("http://localhost:8080/hello")
                    .then(response => response.text())
                    .then(data => {
                        console.log(data);
                    })
            }}>test /hello</button>
        </div>
    );
}
