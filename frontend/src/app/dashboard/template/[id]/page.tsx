"use client"

import "./template.scss"
import {useParams, useSearchParams} from "next/navigation"
import {useApolloClient} from "@apollo/client"
import ErrorPage from "@/pages/errorPage/errorPage"
import LoadingPage from "@/pages/loadingPage/loadingPage"
import React, {useEffect, useState} from "react"
import {
    ShotAttributeBase,
    ShotAttributeTemplateBase,
    ShotAttributeType,
    ShotlistDto,
    TemplateDto
} from "../../../../../lib/graphql/generated"
import gql from "graphql-tag"
import {wuGeneral} from "@yanikkendler/web-utils/dist"
import {ChevronDown, List, Pen, Pencil, Plus, Type} from "lucide-react"
import Input from "@/components/input/input"
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import ShotAttributeDefinition from "@/components/shotAttributeDefinition/shotAttributeDefinition"
import {Popover} from "radix-ui"
import {apolloClient} from "@/ApolloWrapper"
import ShotAttributeTemplate from "@/components/shotAttributeTemplate/shotAttributeTemplate"
import {AnySceneAttributeDefinition, AnyShotAttributeTemplate} from "@/util/Types"

export default function Template (){
    const params = useParams<{ id: string }>()
    const id = params?.id || ""

    const [template, setTemplate] = useState<{data: TemplateDto, loading: boolean, error: any}>({data: {} as TemplateDto, loading: true, error: null})

    const client = useApolloClient()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if(!id || id.length !== 36)
            setTemplate({data: {} as TemplateDto, loading: false, error: new Error("Invalid template ID")})
        else
            loadTemplate()
    }, []);

    const loadTemplate = async (noCache: boolean = false) => {
        try{
            const { data, errors, loading } = await client.query({query: gql`
                    query template($id: String!){
                        template(id: $id) {
                            id
                            name
                            sceneAttributes {
                                id
                                name
                                position
                                __typename
                            }
                            shotAttributes {
                                id
                                name
                                position
                                __typename
                            }
                        }
                    }`,
                variables: {id: id},
                fetchPolicy: noCache ? "no-cache" : "cache-first"})

            console.log(data.template)

            setTemplate({data: data.template, loading: loading, error: errors})
        }catch (e){
            console.error(e)
            setTemplate({data: {} as TemplateDto, loading: false, error: e})
        }
    }

    const updateTemplateName = async (name: string) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation updateTemplate($templateId: String!, $name: String!) {
                    updateTemplate(editDTO: {
                        id: $templateId
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { templateId: id, name: name },
        });

        if (errors) {
            console.error(errors);
            return;
        }
    }

    const handleTemplateNameChange = (name: string) => {
        setTemplate({
            ...template,
            data: {
                ...template.data,
                name: name
            }
        })

        debounceUpdateTemplateName(name)
    }

    const debounceUpdateTemplateName = wuGeneral.debounce(updateTemplateName)

    async function createShotAttributeDefinition(type: ShotAttributeType) {
        const {data, errors} = await client.mutate({
            mutation: gql`
                mutation createShotAttributeTemplate($templateId: String!, $attributeType: ShotAttributeType!) {
                    createShotAttributeTemplate(createDTO: {templateId: $templateId, type: $attributeType}) {
                        id
                        name
                        position
                    }
                }
            `,
            variables: {templateId: id, attributeType: type},
        });
        if (errors) {
            console.error(errors);
            return;
        }

        setTemplate({
            ...template,
            data: {
                ...template.data,
                shotAttributes: [...(template.data.shotAttributes || []), data.createShotAttributeTemplate]
            }
        });
    }

    function handleShotDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id && template.data.shotAttributes) {
            const oldIndex = template.data.shotAttributes.findIndex((definition) => definition!.id === active.id);
            const newIndex = template.data.shotAttributes.findIndex((definition) => definition!.id === over.id);

            //TODO does not work
            apolloClient.mutate({
                mutation: gql`
                    mutation updateShotAttributeTemplatePosition($id: BigInteger!, $position: Int!) {
                        updateShotAttributeTemplate(editDTO:{
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

            setTemplate({
                ...template,
                data: {
                    ...template.data,
                    shotAttributes: arrayMove(template.data.shotAttributes, oldIndex, newIndex)
                }
            })
        }
    }

    function removeShotAttributeTemplate(id: number) {
        if(!template.data.shotAttributes || template.data.shotAttributes.length == 0) return

        let newShotTemplates: AnyShotAttributeTemplate[] = (template.data.shotAttributes as AnyShotAttributeTemplate[]).filter((shotTemplate) => shotTemplate.id != id)

        setTemplate({
            ...template,
            data: {
                ...template.data,
                shotAttributes: newShotTemplates
            }
        })
    }

    if(template.error) return <main className={"dashboardContent"}><ErrorPage settings={{
        title: 'Data could not be loaded',
        description: template.error.message,
        link: {
            text: 'Dashboard',
            href: '/dashboard'
        }
    }}/></main>

    if(template.loading) return <LoadingPage text={"loading template"}/>

    if(!template.data) return <main className={"dashboardContent"}><ErrorPage settings={{
        title: '404',
        description: 'Sorry, we could not find the template you were looking for. Please check the URL or return to the dashboard.',
        link: {
            text: 'Dashboard',
            href: '/dashboard'
        }
    }}/></main>

    return (
        <main className={"template dashboardContent"}>
            <h2>
                <Input
                    value={template.data.name || ""}
                    placeholder={"template name"}
                    valueChange={handleTemplateNameChange}
                    inputClass={"templateName"}
                    maxLength={80}
                    maxWidth={"90ch"}
                    showError={false}
                />
                <div className="spacerContainer">
                    <p className="spacer">{template.data.name}</p>
                    <Pencil size={18} style={{display: template.data.name == "" ? "none" : "block"}}/>
                </div>
            </h2>
            <p className="info">
                <span className="dark">Templates can be selected when creating a shotlist so that you don't have to create the same attributes over and over again.</span>
                <br/>
                None of the changes made to this templated will be reflected in existing shotlists.
                Every shotlist manages its own attributes, only those that are created based on this template <i>after</i> it has been edited will use the updated attributes.</p>
            <h3>Shot Attributes</h3>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleShotDragEnd}
            >
                <SortableContext
                    items={template.data.shotAttributes?.map(def => def!.id) || []}
                    strategy={verticalListSortingStrategy}
                >
                    {
                        template.data.shotAttributes && template.data.shotAttributes.length > 0 &&
                        (<div className="attributeTemplates">
                            {(template.data.shotAttributes as ShotAttributeTemplateBase[]).map(attr =>
                                <ShotAttributeTemplate attributeTemplate={attr} onDelete={removeShotAttributeTemplate} key={attr.id}/>
                            )}
                        </div>)
                    }
                </SortableContext>
            </DndContext>
            <Popover.Root>
                <Popover.Trigger className={"add"}>Add Shot Attribute <Plus size={20}/></Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className="PopoverContent addAttributeTemplatePopup" sideOffset={5} align={"start"}>
                        <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotTextAttribute)}><Type size={16} strokeWidth={3}/>Text</button>
                        <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotSingleSelectAttribute)}><ChevronDown size={16} strokeWidth={3}/>Single select</button>
                        <button onClick={() => createShotAttributeDefinition(ShotAttributeType.ShotMultiSelectAttribute)}><List size={16} strokeWidth={3}/>Multi select</button>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            <h3>Scene Attributes</h3>
            <button className="add">Add Scene Attribute <Plus size={20}/></button>
        </main>
    )
}