'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import "./accountDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import auth from "@/Auth"
import {useRouter} from "next/navigation"
import {X} from "lucide-react"

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
                    mutation createShotlist($name: String!, $userId: String!){
                        createShotlist(createDTO: {
                            name: $name
                            userId: $userId
                        }){ id }
                    }`,
                variables: {name: name, userId: auth.getUser()?.sub}
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
                    <input type="text"/>

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

