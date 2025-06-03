'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useContext, useState} from 'react';
import "./accountDialog.scss"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import {X} from "lucide-react"
import Auth from "@/Auth"
import {User} from "../../../../lib/graphql/generated"
import {Separator, VisuallyHidden} from "radix-ui"
import Input from "@/components/input/input"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import Loader from "@/components/loader/loader"
import {NotificationContext} from "@/context/NotificationContext"
import Link from "next/link"

export function useAccountDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [passwordResetDisabled, setPasswordResetDisabled] = useState(false);

    const client = useApolloClient()
    const {confirm, ConfirmDialog} = useConfirmDialog()
    const notificationContext = useContext(NotificationContext)

    function openAccountDialog() {
        setIsOpen(true);
        getCurrentUser()
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
                        shotlists {
                            name
                        }
                    }
                }`,
            fetchPolicy: "no-cache"
        }
        )

        if(error) {
            console.error("Error fetching current user:", error);
            return;
        }

        setUser(data.currentUser)
    }

    async function resetPassword() {
        setPasswordResetDisabled(true);

        const {data, errors} = await client.mutate({
                mutation: gql`
                    mutation createShotlist{
                        triggerPasswordReset
                    }`
            },
        )

        if(errors) {
            console.error("Error resetting password:", errors);
            setPasswordResetDisabled(false)
            return;
        }

        notificationContext.notify({
            title: "Password reset request sent",
            message: `Please check your email: "${user?.email}" for a link to reset your password.`,
        })

        setTimeout(() => {
            setPasswordResetDisabled(false)
        },10000)
    }


    async function deleteAccount() {
        let decision = await confirm({
            title: "Are you sure?",
            message: `This will delete your account and all associated data. The following shotlist(s) will be deleted: ${user?.shotlists?.map(s => `"${s!.name}"`).join(", ")}. This action cannot be undone.`,
            checkbox: true,
            buttons: {
                confirm: {
                    className: "bad",
                }
            }
        })

        if(!decision) return

        setDeleting(true)

        const {data, errors} = await client.mutate({
                mutation: gql`
                    mutation deleteUser{
                        deleteUser {
                            id
                        }
                    }`
            },
        )

        if(errors) {
            console.error("Error deleting account:", errors);
            return;
        }

        Auth.logout();
    }

    let dialogContent

    if(deleting)
        dialogContent = <Loader text={"loading user"}/>
    else
        dialogContent = (
            <>
                <Input
                    label={"email"}
                    value={user?.email || "unknown"}
                    disabled={true}/><Input
                label={"display name"}
                value={user?.name || "unknown"}
                info={"This a publicly visible name used for collaboration with others. You cannot use it to log in."}
                maxLength={50}
                placeholder={"John Doe"}/>

                <div className="row">
                    <p>Send password reset request to your email</p>
                    <button disabled={passwordResetDisabled} className={"logout"} onClick={resetPassword}>send email</button>
                </div>

                <Separator.Root className={"Separator"}/>

                <div className="row">
                    <p>Report a bug or request a feature</p>
                    <Link href={"https://github.com/YanikKendler/shotlist-tool/issues/new/choose"} target={"_blank"}>new issue</Link>
                </div>

                <Separator.Root className={"Separator"}/>

                <div className="row">
                    <p>Use another account</p>
                    <button className={"logout"} onClick={() => Auth.logout()}>sign out</button>
                </div>
                <div className="row">
                    <p>Delete your account</p>
                    <button className={"delete bad"} onClick={deleteAccount}>delete account</button>
                </div>

                <Separator.Root className={"Separator"}/>

                <div className="row legal">
                    <Link href={"./legal/cookies"} target={"_blank"}>cookies</Link>
                    <Link href={"./legal/privacy"} target={"_blank"}>privacy</Link>
                    <Link href={"./legal/legalNotice"} target={"_blank"}>legal notice</Link>
                    <Link href={"./legal/termsOfUse"} target={"_blank"}>terms of use</Link>
                </div>
            </>
        )

    const AccountDialog = (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"accountDialogOverlay dialogOverlay"}/>
                <Dialog.Content className={"accountContent dialogContent"} aria-describedby={"account dialog"} onOpenAutoFocus={e => e.preventDefault()}>
                    <VisuallyHidden.Root>
                        <Dialog.Description>Manage your account details and preferences.</Dialog.Description>
                    </VisuallyHidden.Root>

                    <Dialog.Title className={"title"}>Account</Dialog.Title>

                    {dialogContent}

                    <button className={"closeButton"} onClick={() => {
                        setIsOpen(false)
                    }}>
                        <X size={18}/>
                    </button>
                    {ConfirmDialog}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )

    return {openAccountDialog, AccountDialog};
}

