'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useContext, useEffect, useState} from 'react';
import "./shotlistOptionsDialog.scss"
import {Separator, Tabs, VisuallyHidden} from "radix-ui"
import {FileDown, List, Users, X} from "lucide-react"
import {ShotlistDto} from "../../../../lib/graphql/generated"
import ShotAttributeDefinition from "@/components/attributeDefinition/shotAttributeDefinition"
import {AnySceneAttributeDefinition, AnyShotAttributeDefinition} from "@/util/Types"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"

export default function ShotlistOptionsDialog({isOpen, setIsOpen, shotlistId, refreshShotlist}: {isOpen: boolean, setIsOpen: any, shotlistId: string, refreshShotlist: () => void}) {
    const [sceneAttributeDefinitions, setSceneAttributeDefinitions] = useState<AnySceneAttributeDefinition[]>([]);
    const [shotAttributeDefinitions, setShotAttributeDefinitions] = useState<AnyShotAttributeDefinition[]>([]);

    const client = useApolloClient()

    useEffect(() => {
        loadData()
    }, [shotlistId]);

    const loadData = async () => {
        const { data, errors, loading } = await client.query({query: gql`
                query data($shotlistId: String!){
                    shotAttributeDefinitions(shotlistId: $shotlistId){
                        id
                        name
                        position

                        ... on ShotSingleSelectAttributeDefinitionDTO{
                            options{
                                id
                                name
                            }
                        }

                        ... on ShotMultiSelectAttributeDefinitionDTO{
                            options {
                                id
                                name
                            }
                        }
                    }
                    sceneAttributeDefinitions(shotlistId: $shotlistId){
                        id
                        name
                        position

                        ... on SceneSingleSelectAttributeDefinitionDTO{
                            options{
                                id
                                name
                            }
                        }

                        ... on SceneMultiSelectAttributeDefinitionDTO{
                            options{
                                id
                                name
                            }
                        }
                    }
                }`, variables: {shotlistId: shotlistId}})

        setSceneAttributeDefinitions(data.sceneAttributeDefinitions)
        setShotAttributeDefinitions(data.shotAttributeDefinitions)
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={"shotlistOptionsDialogOverlay dialogOverlay"}/>
                <Dialog.Content aria-describedby={"confirm action dialog"} className={"shotlistOptionsDialogContent dialogContent"}>
                    <VisuallyHidden.Root>
                        <Dialog.Title className={"title"}>Shotlist Options</Dialog.Title>
                        <Dialog.Description className={"description"}>Edit attributes and collaborators or export a shotlist.</Dialog.Description>
                    </VisuallyHidden.Root>

                    <div className="content">
                        <button className={"closeButton"} onClick={() => setIsOpen(false)}>
                            <X size={18}/>
                        </button>
                        <Tabs.Root className={"dialogPageTabRoot"} defaultValue={"attributes"}>
                            <Tabs.List className={"tabs"}>
                                <Tabs.Trigger value={"attributes"}>
                                    <List size={18} strokeWidth={2}/>
                                    Attributes
                                </Tabs.Trigger>
                                <Tabs.Trigger value={"collaborators"}>
                                    <Users size={18} strokeWidth={2}/>
                                    Collaborators
                                </Tabs.Trigger>
                                <Tabs.Trigger value={"export"}>
                                    <FileDown size={18} strokeWidth={2}/>
                                    Export
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Separator.Root
                                className="Separator"
                                orientation="vertical"
                            />
                            <Tabs.Content value={"attributes"} className={"content"}>

                                <Tabs.Root className={"attributeTypeTabRoot"} defaultValue={"shot"}>
                                    <Tabs.List className={"tabs"}>
                                        <Tabs.Trigger value={"shot"}>
                                            Shot
                                        </Tabs.Trigger>
                                        <Tabs.Trigger value={"scene"}>
                                            Scene
                                        </Tabs.Trigger>
                                    </Tabs.List>
                                    <Tabs.Content value={"shot"} className={"content"}>
                                        {shotAttributeDefinitions.map((attribute) => (
                                            <ShotAttributeDefinition attribute={attribute} key={attribute.id}/>
                                        ))}
                                    </Tabs.Content>
                                    <Tabs.Content value={"scene"} className={"content"}>
                                        {sceneAttributeDefinitions.map((attribute) => (
                                            <ShotAttributeDefinition attribute={attribute as AnyShotAttributeDefinition} key={attribute.id}/>
                                        ))}
                                    </Tabs.Content>
                                </Tabs.Root>
                            </Tabs.Content>
                            <Tabs.Content value={"collaborators"} className={"content"}>
                                collaborators
                            </Tabs.Content>
                            <Tabs.Content value={"export"} className={"content"}>
                                export
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
