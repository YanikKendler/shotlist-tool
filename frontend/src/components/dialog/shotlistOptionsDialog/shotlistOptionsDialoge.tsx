'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useContext, useEffect, useState} from 'react';
import "./shotlistOptionsDialog.scss"
import {Separator, Tabs, VisuallyHidden} from "radix-ui"
import {FileDown, List, Users, X} from "lucide-react"
import ShotAttributeDefinition from "@/components/attributeDefinition/shotAttributeDefinition"
import {AnySceneAttributeDefinition, AnyShotAttributeDefinition} from "@/util/Types"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {apolloClient} from "@/ApolloWrapper"
import {SceneDto, ShotAttributeDefinitionBase} from "../../../../lib/graphql/generated"

export default function ShotlistOptionsDialog({isOpen, setIsOpen, shotlistId, refreshShotlist}: {isOpen: boolean, setIsOpen: any, shotlistId: string, refreshShotlist: () => void}) {
    const [sceneAttributeDefinitions, setSceneAttributeDefinitions] = useState<AnySceneAttributeDefinition[]>([]);
    const [shotAttributeDefinitions, setShotAttributeDefinitions] = useState<AnyShotAttributeDefinition[]>([]);

    const client = useApolloClient()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const removeAttributeDefinition = (definitionId: number) => {
        if(!shotAttributeDefinitions || shotAttributeDefinitions.length == 0) return

        let newShotDefinitions: AnyShotAttributeDefinition[] = shotAttributeDefinitions.filter((shotDefinition: AnyShotAttributeDefinition) => shotDefinition.id != definitionId)

        setShotAttributeDefinitions(newShotDefinitions)
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setShotAttributeDefinitions((definition) => {
                const oldIndex = shotAttributeDefinitions.findIndex((definition) => definition.id === active.id);
                const newIndex = shotAttributeDefinitions.findIndex((definition) => definition.id === over.id);

                apolloClient.mutate({
                    mutation: gql`
                        mutation updateShotDefinition($id: BigInteger!, $position: Int!) {
                            updateShotAttributeDefinition(editDTO:{
                                id: $id,
                                position: $position
                            }){
                                id
                                position
                            }
                        }
                    `,
                    variables: {id: active.id, position: newIndex},
                }).then((response) => {
                    refreshShotlist()
                })


                return arrayMove(shotAttributeDefinitions, oldIndex, newIndex)
            });
        }
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
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <SortableContext
                                                items={shotAttributeDefinitions.map(def => def.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="definitions">
                                                    {shotAttributeDefinitions.map((attribute) => (
                                                        <ShotAttributeDefinition
                                                            definition={attribute}
                                                            key={attribute.id}
                                                            onDelete={removeAttributeDefinition}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>

                                    </Tabs.Content>
                                    <Tabs.Content value={"scene"} className={"content"}>
                                        <div className="definitions">
                                            {sceneAttributeDefinitions.map((attribute) => (
                                                <ShotAttributeDefinition definition={attribute as AnyShotAttributeDefinition} key={attribute.id} onDelete={() => {}}/>
                                            ))}
                                        </div>
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
