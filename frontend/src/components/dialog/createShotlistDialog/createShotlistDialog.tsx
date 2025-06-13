'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useState} from 'react';
import "./createShotlistDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import Input from "@/components/input/input"
import Loader from "@/components/loader/loader"
import {TemplateDto} from "../../../../lib/graphql/generated"
import SimpleSelect from "@/components/simpleSelect/simpleSelect"
import {SelectOption} from "@/util/Types"
import {useRouter} from "next/navigation"

export function useCreateShotlistDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [name, setName] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [templates, setTemplates] = useState<SelectOption[]>([])
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    const router = useRouter()
    const client = useApolloClient()

    async function loadTemplates() {
        let {data} = await client.query({
            query: gql`
                query getTemplates {
                    templates {
                        id
                        name
                    }
                }
            `,
            fetchPolicy: "no-cache"
        })

        const options: SelectOption[] = data.templates.map((template: TemplateDto) => ({
            label: template.name,
            value: template.id
        }))

        setTemplates(options)
    }

    function openCreateShotlistDialog(): Promise<boolean> {
        setIsOpen(true)
        setIsLoading(false)
        loadTemplates()
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
                    mutation createShotlist($name: String!, $templateId: String) {
                        createShotlist(createDTO: {
                            name: $name
                            templateId: $templateId
                        }){ id }
                    }`,
                variables: {name: name, templateId: selectedTemplateId}
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
                            <SimpleSelect
                                label={"Template"}
                                name={"Template"}
                                onChange={setSelectedTemplateId}
                                options={templates}
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
                        </>
                    }
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openCreateShotlistDialog, CreateShotlistDialog};
}

