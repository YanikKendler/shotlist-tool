'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import "./accountDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import auth from "@/Auth"
import {useRouter} from "next/navigation"
import {X} from "lucide-react"
import Auth from "@/Auth"

export function useAccountDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();

    const client = useApolloClient()

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

    function handleConfirm() {
        setIsOpen(false);
        promiseResolver?.(true);
    }

    function handleCancel() {
        setIsOpen(false);
        promiseResolver?.(false);
    }

    const AccountDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"accountDialogOverlay dialogOverlay"}/>
                <Dialog.Content className={"accountContent dialogContent"} aria-describedby={"account dialog"}>
                    <Dialog.Title className={"title"}>Account</Dialog.Title>
                    <h2>hi, {Auth.getUser()?.name}</h2>
                    <p>Since this is an early alpha test, account settings are not yet available</p>
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

