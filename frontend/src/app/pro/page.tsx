"use client";

import Auth from "@/Auth"
import "./pro.scss";
import {use, useEffect, useState} from "react"
import auth from "@/Auth"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import {useRouter} from "next/navigation"
import {Config} from "@/util/Utils"
import PaymentService from "@/service/PaymentService"

export default function Pro(){
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const client = useApolloClient();
    const router = useRouter();

    useEffect(() => {
        client.query({
            query: gql`
                query checkCurrentUserTier {
                    currentUser {
                        id
                        tier
                        hasCancelled
                    }
                }`,
            fetchPolicy: "no-cache"
        }).then(({data, error, loading}) => {
            if(error) {
                console.error("Error fetching current user:", error);
                Auth.logout();
            }
            if(data.currentUser.tier !== "BASIC"){
                if(data.currentUser.hasCancelled) {
                    PaymentService.manageSubscription()
                }
                else{
                    router.push("/dashboard");
                }
            }
            else{
                setIsLoading(false);
            }
        })
    }, []);

    if(isLoading) return <LoadingPage text={"loading account data"}/>

    return (
        <main className={"pro"}>
            <div className="content">
                <h1>Thank you for choosing Shotly Pro!</h1>
                <p>You will get access to unlimited Shotlists and Collaborators.</p>
                <button onClick={PaymentService.subscribeToPro}>Continue to checkout</button>
            </div>
        </main>
    );
}