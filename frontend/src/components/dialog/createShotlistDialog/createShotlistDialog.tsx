'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useState} from 'react';
import "./createShotlistDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import Input from "@/components/input/input"
import Loader from "@/components/loader/loader"
import {TemplateDto, UserDto} from "../../../../lib/graphql/generated"
import SimpleSelect from "@/components/simpleSelect/simpleSelect"
import {SelectOption} from "@/util/Types"
import {useRouter} from "next/navigation"

export function useCreateShotlistDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [promiseResolver, setPromiseResolver] = useState<(value: boolean) => void>();
    const [name, setName] = useState<string>("")
    const [isCreating, setIsCreating] = useState(false)
    const [templates, setTemplates] = useState<SelectOption[]>([{label: "No template", value: "null"}]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("null");
    const [currentUser, setCurrentUser] = useState<UserDto | null>(null);

    const router = useRouter()
    const client = useApolloClient()

    async function loadData() {
        let {data} = await client.query({
            query: gql`
                query createShotlistData {
                    templates {
                        id
                        name
                    }
                    currentUser {
                        tier
                        shotlistCount
                    }
                }
            `,
            fetchPolicy: "no-cache"
        })

        setCurrentUser(data.currentUser)

        const options: SelectOption[] = data.templates.map((template: TemplateDto) => ({
            label: template.name,
            value: template.id
        }))

        options.unshift({label: "No template", value: "null"})

        setTemplates(options)

        if(options.length > 1)
            setSelectedTemplateId(options[1].value);
    }

    function openCreateShotlistDialog(): Promise<boolean> {
        setIsOpen(true)
        setIsCreating(false)
        loadData()
        return new Promise((resolve) => {
            setPromiseResolver(() => resolve);
        })
    }

    async function handleConfirm() {
        if (name.length <= 2) {
            return;
        }
        setIsCreating(true)

        let templateId = selectedTemplateId === "null" ? null : selectedTemplateId;

        const {data, errors} = await client.mutate({
                mutation: gql`
                    mutation createShotlist($name: String!, $templateId: String) {
                        createShotlist(createDTO: {
                            name: $name
                            templateId: $templateId
                        }){ id }
                    }`,
                variables: {name: name, templateId: templateId}
            },
        )
        router.push(`/shotlist/${data.createShotlist.id}`)
        promiseResolver?.(true)
    }

    function handleCancel() {
        setIsOpen(false)
        promiseResolver?.(false)
    }

    let content: React.ReactElement

    if(!currentUser)
        content = <>
            <Dialog.Title className={"title center"}>Create Shotlist</Dialog.Title>
            <Loader/>
        </>
    else if(currentUser.tier == "BASIC" && currentUser?.shotlistCount != 0)
        content = <>
            <Dialog.Title className={"title center"}>Sorry, you have reached the maximum number of Shotlists.</Dialog.Title>
            <p>Your account is on the basic tier, that means you are limited to a single shotlist. Please consider going Pro for 2.99€ / month.</p>
            <div className={"buttons"}>
                <button onClick={e => {
                    e.stopPropagation();
                    handleCancel();
                }}>cancel
                </button>
                <a className={"accent"} href="/pro">Choose Pro</a>
            </div>
        </>
    else if (isCreating)
        content = <>
            <Dialog.Title className={"title center"}>Creating shotlist "{name}"</Dialog.Title>
            <div className={"loading"}>
                <Loader/>
                <p>You will be redirected shortly</p>
            </div>
        </>
    else
        content = <>
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
                value={selectedTemplateId}
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


    const CreateShotlistDialog = (
        <Dialog.Root open={isOpen || isCreating} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"createShotlistDialogOverlay dialogOverlay"}/>
                <Dialog.Content
                    aria-describedby={"confirm action dialog"}
                    className={"createShotlistDialogContent dialogContent"} 
                    onKeyDown={(e) => {
                        if(e.key === "Enter" && !isCreating) {
                            e.preventDefault()
                            handleConfirm()
                        }
                    }}
                >
                    {content}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );

    return {openCreateShotlistDialog, CreateShotlistDialog};
}

