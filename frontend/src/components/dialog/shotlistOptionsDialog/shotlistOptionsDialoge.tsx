'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, {useEffect, useState} from 'react';
import "./shotlistOptionsDialog.scss"
import {Popover, Separator, Tabs, VisuallyHidden} from "radix-ui"
import {ChevronDown, FileDown, List, Plus, Type, Users, X} from "lucide-react"
import ShotAttributeDefinition from "@/components/shotAttributeDefinition/shotAttributeDefinition"
import {
    AnySceneAttributeDefinition,
    AnyShotAttributeDefinition,
    ShotSingleOrMultiSelectAttributeDefinition
} from "@/util/Types"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import {apolloClient} from "@/ApolloWrapper"
import {
    SceneAttributeType,
    ShotAttributeType,
    ShotSelectAttributeOptionDefinition
} from "../../../../lib/graphql/generated"
import Image from "next/image"
import SceneAttributeDefinition from "@/components/sceneAttributeDefinition/sceneAttributeDefinition"

export default function ShotlistOptionsDialog({isOpen, setIsOpen, shotlistId, refreshShotlist}: {isOpen: boolean, setIsOpen: any, shotlistId: string, refreshShotlist: () => void}) {
    const [sceneAttributeDefinitions, setSceneAttributeDefinitions] = useState<AnySceneAttributeDefinition[] | null>(null);
    const [shotAttributeDefinitions, setShotAttributeDefinitions] = useState<AnyShotAttributeDefinition[] | null>(null);
    // used for refreshing the shotlist on dialog close, only when any data has been edited
    const [stringifiedAttributeData, setStringifiedAttributeData] = useState<string>("");
    const [dataChanged, setDataChanged] = useState(false);

    const client = useApolloClient()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadData()
        setDataChanged(false)
    }, [shotlistId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setStringifiedAttributeData(JSON.stringify(shotAttributeDefinitions) + JSON.stringify(sceneAttributeDefinitions))
        }
    }, [isOpen]);

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
                }`,
            variables: {shotlistId: shotlistId},
            fetchPolicy: "no-cache",
            },
        )

        setSceneAttributeDefinitions(data.sceneAttributeDefinitions)
        setShotAttributeDefinitions(data.shotAttributeDefinitions)

        setStringifiedAttributeData(JSON.stringify(data.shotAttributeDefinitions) + JSON.stringify(data.sceneAttributeDefinitions))
    }

    function removeShotAttributeDefinition(definitionId: number) {
        if(!shotAttributeDefinitions || shotAttributeDefinitions.length == 0) return

        let newShotDefinitions: AnyShotAttributeDefinition[] = shotAttributeDefinitions.filter((shotDefinition: AnyShotAttributeDefinition) => shotDefinition.id != definitionId)

        setShotAttributeDefinitions(newShotDefinitions)
    }

    async function createShotAttributeDefinition(type: ShotAttributeType) {
        const {data, errors} = await client.mutate({
            mutation: gql`
                mutation createShotAttributeDefinition($shotlistId: String!, $attributeType: ShotAttributeType!) {
                    createShotAttributeDefinition(createDTO: {
                        shotlistId: $shotlistId,
                        type: $attributeType
                    }) {
                        id
                        name
                        position
                    }
                }
            `,
            variables: {shotlistId: shotlistId, attributeType: type},
        });
        if (errors) {
            console.error(errors);
            return;
        }

        setShotAttributeDefinitions([
            ...shotAttributeDefinitions || [],
            data.createShotAttributeDefinition
        ])
    }

    function handleShotDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id && shotAttributeDefinitions) {
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
                })

                return arrayMove(shotAttributeDefinitions, oldIndex, newIndex)
            })
        }
    }

    function removeSceneAttributeDefinition(definitionId: number) {
        if(!sceneAttributeDefinitions || sceneAttributeDefinitions.length == 0) return

        let newSceneDefinitions: AnySceneAttributeDefinition[] = sceneAttributeDefinitions.filter((sceneDefinition: AnySceneAttributeDefinition) => sceneDefinition.id != definitionId)

        setSceneAttributeDefinitions(newSceneDefinitions)
    }

    async function createSceneAttributeDefinition(type: SceneAttributeType) {
        const {data, errors} = await client.mutate({
            mutation: gql`
                mutation createSceneAttributeDefinition($shotlistId: String!, $attributeType: SceneAttributeType!) {
                    createSceneAttributeDefinition(createDTO: {
                        shotlistId: $shotlistId,
                        type: $attributeType
                    }) {
                        id
                        name
                        position
                    }
                }
            `,
            variables: {shotlistId: shotlistId, attributeType: type},
        });
        if (errors) {
            console.error(errors);
            return;
        }

        setSceneAttributeDefinitions([
            ...sceneAttributeDefinitions || [],
            data.createSceneAttributeDefinition
        ])
    }

    function handleSceneDragEnd(event: any) {
        const {active, over} = event;


        if (active.id !== over.id && sceneAttributeDefinitions) {
            setSceneAttributeDefinitions((definition) => {
                const oldIndex = sceneAttributeDefinitions.findIndex((definition) => definition.id === active.id);
                const newIndex = sceneAttributeDefinitions.findIndex((definition) => definition.id === over.id);

                apolloClient.mutate({
                    mutation: gql`
                        mutation updateSceneDefinition($id: BigInteger!, $position: Int!) {
                            updateSceneAttributeDefinition(editDTO:{
                                id: $id,
                                position: $position
                            }){
                                id
                                position
                            }
                        }
                    `,
                    variables: {id: active.id, position: newIndex},
                }).then(result => {
                    console.log(result)
                })

                return arrayMove(sceneAttributeDefinitions, oldIndex, newIndex)
            })
        }
    }

    function runRefreshShotlistCheck(){
        let currentAttributeData = JSON.stringify(shotAttributeDefinitions) + JSON.stringify(sceneAttributeDefinitions)

        if(dataChanged || currentAttributeData != stringifiedAttributeData) {
            refreshShotlist()
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={(isOpen: boolean) => {
            setIsOpen(isOpen)
            runRefreshShotlistCheck()
        }}>
            <Dialog.Portal>
                <Dialog.Overlay className={"shotlistOptionsDialogOverlay dialogOverlay"}/>
                <Dialog.Content aria-describedby={"confirm action dialog"} className={"shotlistOptionsDialogContent dialogContent"}>
                    <VisuallyHidden.Root>
                        <Dialog.Title className={"title"}>Shotlist Options</Dialog.Title>
                        <Dialog.Description className={"description"}>Edit attributes and collaborators or export a shotlist.</Dialog.Description>
                    </VisuallyHidden.Root>

                    <div className="content">
                        <button className={"closeButton"} onClick={() => {
                            setIsOpen(false)
                            runRefreshShotlistCheck()
                        }}>
                            <X size={18}/>
                        </button>
                        <Tabs.Root className={"optionsDialogPageTabRoot"} defaultValue={"attributes"}>
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
                                        {!shotAttributeDefinitions ?
                                            <Image src={"/loadingBars.svg"} alt={"loading..."} width={60} height={75}/> :
                                            <>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleShotDragEnd}
                                                >
                                                    <SortableContext
                                                        items={shotAttributeDefinitions?.map(def => def.id) || []}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        <div className="definitions">
                                                            {shotAttributeDefinitions?.map((attribute) => (
                                                                <ShotAttributeDefinition
                                                                    attributeDefinition={attribute}
                                                                    key={attribute.id}
                                                                    onDelete={removeShotAttributeDefinition}
                                                                    dataChanged={() => setDataChanged(true)}
                                                                />
                                                            ))}
                                                            {shotAttributeDefinitions?.length == 0 &&
                                                                <div className={"noResults"}>
                                                                    No attributes defined yet :(
                                                                </div>
                                                            }
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                                <Popover.Root>
                                                    <Popover.Trigger className={"add"}>Add attribute <Plus/></Popover.Trigger>
                                                    <Popover.Portal>
                                                        <Popover.Content className="PopoverContent addAttributeDefinitionPopup" sideOffset={5} align={"start"}>
                                                            <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotTextAttribute)}><Type size={16}/>Text</button>
                                                            <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotSingleSelectAttribute)}><ChevronDown size={16}/>Single select</button>
                                                            <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotMultiSelectAttribute)}><List size={16}/>Multi select</button>
                                                        </Popover.Content>
                                                    </Popover.Portal>
                                                </Popover.Root>
                                            </>
                                        }
                                    </Tabs.Content>
                                    <Tabs.Content value={"scene"} className={"content"}>
                                        {!sceneAttributeDefinitions ?
                                            <Image src={"/loadingBars.svg"} alt={"loading..."} width={60} height={75}/> :
                                            <>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleSceneDragEnd}
                                                >
                                                    <SortableContext
                                                        items={sceneAttributeDefinitions?.map(def => def.id) || []}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        <div className="definitions">
                                                            {sceneAttributeDefinitions?.map((attribute) => (
                                                                <SceneAttributeDefinition
                                                                    attributeDefinition={attribute}
                                                                    key={attribute.id}
                                                                    onDelete={removeSceneAttributeDefinition}
                                                                    dataChanged={() => setDataChanged(true)}
                                                                />
                                                            ))}
                                                            {sceneAttributeDefinitions?.length == 0 &&
                                                                <div className={"noResults"}>
                                                                    No attributes defined yet :(
                                                                </div>
                                                            }
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                                <Popover.Root>
                                                    <Popover.Trigger className={"add"}>Add attribute <Plus/></Popover.Trigger>
                                                    <Popover.Portal>
                                                        <Popover.Content className="PopoverContent addAttributeDefinitionPopup" sideOffset={5} align={"start"}>
                                                            <button onClick={() => createSceneAttributeDefinition(SceneAttributeType.SceneTextAttribute)}><Type size={16}/>Text</button>
                                                            <button onClick={() => createSceneAttributeDefinition(SceneAttributeType.SceneSingleSelectAttribute)}><ChevronDown size={16}/>Single select</button>
                                                            <button onClick={() => createSceneAttributeDefinition(SceneAttributeType.SceneMultiSelectAttribute)}><List size={16}/>Multi select</button>
                                                        </Popover.Content>
                                                    </Popover.Portal>
                                                </Popover.Root>
                                            </>
                                        }
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
