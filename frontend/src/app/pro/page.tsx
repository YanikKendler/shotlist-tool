"use client";

import Auth from "@/Auth"

export default function Pro(){
    function buy() {
        fetch("http://localhost:8080/stripe/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${Auth.getIdToken()}`
            },
            body: JSON.stringify({
                lookupKey: "shotly_pro_monthly"
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                window.location.href = data.url;
            })
            .catch(err => console.error("Error:", err));
    }


    return (
        <div className="pro-page">
            <h1>Thank you for choosing Shotly Pro</h1>
            <p>You will get access to unlimited Shotlists and Collaborators.</p>
            <button onClick={buy}>Continue to checkout</button>
        </div>
    );
}