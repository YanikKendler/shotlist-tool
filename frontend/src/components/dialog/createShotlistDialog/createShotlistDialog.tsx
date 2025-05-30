'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useEffect, useState} from 'react';
import "./createShotlistDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import auth from "@/Auth"
import {useRouter} from "next/navigation"
import {is} from "@babel/types"
import Image from "next/image"
import Input from "@/components/input/input"
import Loader from "@/components/loader/loader"

export function useCreateShotlistDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [name, setName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const client = useApolloClient()

    function openCreateShotlistDialog(): Promise<boolean> {
        setIsOpen(true)
        setIsLoading(false)
        return new Promise((resolve) => {
            setPromiseResolver(() => resolve);
        })
    }

    async function handleConfirm() {
        if (name.length <= 2) {
            return;
        }
        setIsLoading(true)
        const {data, errors} = await client.mutate({
                mutation: gql`
                    mutation createShotlist($name: String!){
                        createShotlist(createDTO: {
                            name: $name
                        }){ id }
                    }`,
                variables: {name: name, userId: auth.getUser()?.sub}
            },
        )
        router.push(`/shotlist/${data.createShotlist.id}`)
        promiseResolver?.(true)
    }

    function handleCancel() {
        setIsOpen(false)
        promiseResolver?.(false)
    }

    const CreateShotlistDialog = (
        <Dialog.Root open={isOpen || isLoading} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"createShotlistDialogOverlay dialogOverlay"}/>
                <Dialog.Content
                    aria-describedby={"confirm action dialog"}
                    className={"createShotlistDialogContent dialogContent"} 
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !isLoading) {
                            e.preventDefault()
                            handleConfirm()
                        }
                    }}
                >
                    {isLoading ?
                        <>
                            <Dialog.Title className={"title"}>Creating shotlist "{name}"</Dialog.Title>
                            <div className={"loading"}>
                                <Loader/>
                                <p>You will be redirected shortly</p>
                            </div>
                        </>
                        :
                        <>
                            <Dialog.Title className={"title"}>Create Shotlist</Dialog.Title>
                            <Input
                                label={"Name"}
                                valueChange={setName}
                                placeholder={"Interstellar"}
                            />
                            <div className={"buttons"}>
                                <button onClick={e => {
                                    e.stopPropagation();
                                    handleCancel();
                                }}>cancel
                                </button>
                                <button disabled={name.length <= 2} onClick={e => {
                                    e.stopPropagation();
                                    handleConfirm();
                                }} className={"accent"}>create
                                </button>
                            </div>
                            <button onClick={() => {console.log(dialogContentRef.current)}}>test</button>
                        </>
                    }
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openCreateShotlistDialog, CreateShotlistDialog};
}

