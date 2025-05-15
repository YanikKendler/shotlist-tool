"use client"

import {useEffect} from "react"
import auth from "@/Auth"
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
    const router = useRouter()

    useEffect(() => {
        auth.handleAuthentication()
            .then(() => {
                console.log("redirecting to dashboard")
                router.push('/dashboard')
            })
            .catch((error) => {
                console.error("Error during authentication:", error);
            });
    }, []);

    return (
        <div>
            <h1>Callback Page</h1>
            <p>This is the callback page.</p>
        </div>
    )
}