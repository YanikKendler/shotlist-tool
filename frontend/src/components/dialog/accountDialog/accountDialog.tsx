'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useEffect, useState} from 'react';
import "./accountDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import {Info, X} from "lucide-react"
import Auth from "@/Auth"
import {User} from "../../../../lib/graphql/generated"
import {Tooltip} from "radix-ui"
import Input from "@/components/input/input"

export function useAccountDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [user, setUser] = useState<User | null>(null);

    const client = useApolloClient()

    useEffect(() => {
        getCurrentUser()
    }, []);

    function openAccountDialog(): Promise<boolean> {
        setIsOpen(true);
        return new Promise((resolve) => {
            setPromiseResolver(() => resolve);
        });
    }

    async function createShotlist() {
        const {data, errors} = await client.mutate({
                mutation: gql`
                    mutation createShotlist($name: String!){
                        createShotlist(createDTO: {
                            name: $name
                        }){ id }
                    }`,
                variables: {name: name}
            },
        )
    }

    async function getCurrentUser(){
        const {data, loading, error} = await client.query({
            query: gql`
                query currentUser{
                    currentUser {
                        id
                        name
                        email
                        createdAt
                    }
                }`
        })

        setUser(data.currentUser)
    }

    const AccountDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"accountDialogOverlay dialogOverlay"}/>
                <Dialog.Content className={"accountContent dialogContent"} aria-describedby={"account dialog"}>
                    <Dialog.Title className={"title"}>Account</Dialog.Title>

                    <Input
                        label={"email"}
                        value={user?.email || "unknown"}
                        disabled={true}
                    />

                    <Input
                        label={"name"}
                        value={user?.name || "unknown"}
                        info={"This a publicly visible name used for collaboration with others. You can not use it to log in."}
                        maxLength={50}
                        placeholder={"John Doe"}
                    />

                    <button className={"logout"} onClick={() => Auth.logout()}>sign out</button>

                    <button className={"closeButton"} onClick={() => {
                        setIsOpen(false)
                    }}>
                        <X size={18}/>
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openAccountDialog, AccountDialog};
}

