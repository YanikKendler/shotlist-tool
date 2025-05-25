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
    ShotAttributeType, ShotlistDto,
    ShotSelectAttributeOptionDefinition
} from "../../../../lib/graphql/generated"
import Image from "next/image"
import SceneAttributeDefinition from "@/components/sceneAttributeDefinition/sceneAttributeDefinition"
import ReactPDF, {pdf, PDFDownloadLink} from '@react-pdf/renderer';
import PDFExport from "@/components/PDFExport"
import {wuTime} from "@yanikkendler/web-utils/dist"
import {useRouter} from "next/navigation"

export type ShotlistOptionsDialogPage = "attributes" | "collaborators" | "export"

export type ShotlistOptionsDialogSubPage = "shot" | "scene"

export default function ShotlistOptionsDialog({isOpen, setIsOpen, selectedPage, shotlistId, refreshShotlist}:
{
    isOpen: boolean,
    setIsOpen: any,
    selectedPage: { main: ShotlistOptionsDialogPage, sub: ShotlistOptionsDialogSubPage },
    shotlistId: string,
    refreshShotlist: () => void
}) {
    const [sceneAttributeDefinitions, setSceneAttributeDefinitions] = useState<AnySceneAttributeDefinition[] | null>(null);
    const [shotAttributeDefinitions, setShotAttributeDefinitions] = useState<AnyShotAttributeDefinition[] | null>(null);
    const [shotlist, setShotlist] = useState<ShotlistDto>({} as ShotlistDto);
    // used for refreshing the shotlist on dialog close, only when any data has been edited
    const [stringifiedAttributeData, setStringifiedAttributeData] = useState<string>("");
    const [dataChanged, setDataChanged] = useState(false);

    const client = useApolloClient()
    const router = useRouter()

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
        updateUrl(selectedPage.main, selectedPage.sub)
    }, [isOpen]);

    const updateUrl = (page?: ShotlistOptionsDialogPage, subPage?: ShotlistOptionsDialogSubPage) => {
        const url = new URL(window.location.href)
        if(isOpen){
            url.searchParams.set("oo", "true") // options open
            if(page)
                url.searchParams.set("mp", page) // main page
            if(subPage)
                url.searchParams.set("sp", subPage) // sub page
        }
        else {
            url.searchParams.delete("oo") // options open
            url.searchParams.delete("mp") // main page
            url.searchParams.delete("sp") // sub page
        }

        router.push(url.toString())
    }

    const loadData = async () => {
        const { data, errors, loading } = await client.query({query: gql`
                query data($shotlistId: String!){
                    shotlist(id: $shotlistId){
                        id
                        name
                    }
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
        setShotlist(data.shotlist)

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

    async function exportPDF() {
            const {data, error, loading} = await client.query({
                    query: gql`
                        query shotlistForExport($id: String!) {
                            shotlist(id: $id){
                                id
                                name
                                scenes{
                                    id
                                    position
                                    attributes{
                                        id
                                        definition{id, name, position}

                                        ... on SceneSingleSelectAttributeDTO{
                                            singleSelectValue{id,name}
                                        }

                                        ... on SceneMultiSelectAttributeDTO{
                                            multiSelectValue{id,name}
                                        }
                                        ... on SceneTextAttributeDTO{
                                            textValue
                                        }
                                    }
                                    shots {
                                        id
                                        position
                                        attributes{
                                            id
                                            definition{id, name, position}

                                            ... on ShotSingleSelectAttributeDTO{
                                                singleSelectValue{id,name}
                                            }

                                            ... on ShotMultiSelectAttributeDTO{
                                                multiSelectValue{id,name}
                                            }
                                            ... on ShotTextAttributeDTO{
                                                textValue
                                            }
                                        }
                                    }
                                }
                                sceneAttributeDefinitions{
                                    id
                                    name
                                }
                                shotAttributeDefinitions{
                                    id
                                    name
                                }
                            }
                        }`,
                    variables: {id: shotlistId}
                }
            )

        console.log(data)

        const blob = await pdf(<PDFExport data={data.shotlist}/>).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `shotly-${shotlist.name}-${wuTime.toFullDateTimeString(Date.now())}.pdf`
        link.click()
        URL.revokeObjectURL(url)
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
                        <Tabs.Root className={"optionsDialogPageTabRoot"} defaultValue={selectedPage.main} onValueChange={page => updateUrl(page as ShotlistOptionsDialogPage)}>
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
                                <Tabs.Root className={"attributeTypeTabRoot"} defaultValue={selectedPage.sub} onValueChange={page => updateUrl("attributes", page as ShotlistOptionsDialogSubPage)}>
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

                                <button onClick={exportPDF}>test export</button>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
