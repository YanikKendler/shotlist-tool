'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useEffect, useState} from 'react';
import "./accountDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import {Info, X} from "lucide-react"
import Auth from "@/Auth"
import {User} from "../../../../lib/graphql/generated"
import {Separator, Tooltip, VisuallyHidden} from "radix-ui"
import Input from "@/components/input/input"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"

export function useAccountDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const client = useApolloClient()
    const {confirm, ConfirmDialog} = useConfirmDialog()

    function openAccountDialog() {
        setIsOpen(true);
        if(!user)
            getCurrentUser()
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
        const {data, error} = await client.query({
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

        if(error) {
            console.error("Error fetching current user:", error);
            return;
        }

        setUser(data.currentUser)
    }

    async function deleteAccount() {
        let decision = await confirm({
            title: "Are you sure?",
            message: "This will delete your account and all associated data. This action cannot be undone.",
            checkbox: true,
            buttons: {
                confirm: {
                    className: "bad",
                }
            }
        })

        if(!decision) return


    }

    const AccountDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"accountDialogOverlay dialogOverlay"}/>
                <Dialog.Content className={"accountContent dialogContent"} aria-describedby={"account dialog"}>
                    <VisuallyHidden.Root>
                        <Dialog.Description>Manage your account details and preferences.</Dialog.Description>
                    </VisuallyHidden.Root>

                    <Dialog.Title className={"title"}>Account</Dialog.Title>

                    <Input
                        label={"email"}
                        value={user?.email || "unknown"}
                        disabled={true}
                    />

                    <Input
                        label={"name"}
                        value={user?.name || "unknown"}
                        info={"This a publicly visible name used for collaboration with others. You cannot use it to log in."}
                        maxLength={50}
                        placeholder={"John Doe"}
                    />

                    <Separator.Root className={"Separator"}/>

                    <div className="row">
                        <p>Use another account</p>
                        <button className={"logout"} onClick={() => Auth.logout()}>sign out</button>
                    </div>
                    <div className="row">
                        <p>Delete your account</p>
                        <button className={"delete bad"} onClick={deleteAccount}>delete account</button>
                    </div>

                    <button className={"closeButton"} onClick={() => {
                        setIsOpen(false)
                    }}>
                        <X size={18}/>
                    </button>
                    {ConfirmDialog}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openAccountDialog, AccountDialog};
}

