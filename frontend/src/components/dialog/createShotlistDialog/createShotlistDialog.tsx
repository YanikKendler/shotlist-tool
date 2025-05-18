'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import "./createShotlistDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import auth from "@/Auth"
import {useRouter} from "next/navigation"

export function useCreateShotlistDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [name, setName] = useState<string>("")

    const router = useRouter()
    const client = useApolloClient()

    function openCreateShotlistDialog(): Promise<boolean> {
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
                variables: {name: name, userId: auth.getUser()?.sub}
            },
        )
        router.push(`/shotlist/${data.createShotlist.id}`)
    }

    function handleConfirm() {
        createShotlist()
        setIsOpen(false);
        promiseResolver?.(true);
    }

    function handleCancel() {
        setIsOpen(false);
        promiseResolver?.(false);
    }

    const CreateShotlistDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"createShotlistDialogOverlay dialogOverlay"}/>
                <Dialog.Content aria-describedby={"confirm action dialog"} className={"createShotlistDialogContent dialogContent"}>
                    <Dialog.Title className={"title"}>Create Shotlist</Dialog.Title>
                    {/*TODO<p>Template Selection etc.</p>*/}
                    <div className="labeledInput">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" onInput={e => setName(e.currentTarget.value)}/>
                    </div>
                    <div className={"buttons"}>
                        <button onClick={e => {e.stopPropagation();handleCancel()}}>cancel</button>
                        <button onClick={e => {e.stopPropagation();handleConfirm()}} className={"accent"}>create</button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openCreateShotlistDialog, CreateShotlistDialog};
}

