'use client'

import {SceneAttributeParser} from "@/util/AttributeParser"
import {SceneDto} from "../../../lib/graphql/generated"
import "./scene.scss"
import React, {useContext, useEffect, useState} from "react"
import {Collapsible, Popover, Separator, Tooltip} from "radix-ui"
import SceneAttribute from "@/components/sceneAttribute/sceneAttribute"
import {AnySceneAttribute, AnyShotAttribute} from "@/util/Types"
import {CornerDownRight, GripVertical, List, NotepadText, Trash} from "lucide-react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';
import {ShotlistContext} from "@/context/ShotlistContext"

export default function Scene({scene, position, expanded, onSelect, onDelete}: {scene: SceneDto, position:number, expanded: boolean, onSelect: ( id: string) => void, onDelete: ( id: string) => void}) {
    const [overflowVisible, setOverflowVisible] = useState(false);
    const [sceneAttributes, setSceneAttributes] = useState<AnySceneAttribute[]>(scene.attributes as AnySceneAttribute[]);
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const { confirm, ConfirmDialog } = useConfirmDialog();

    const shotlistContext = useContext(ShotlistContext)

    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: scene.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const client = useApolloClient()

    useEffect(() => {
        if (!expanded) {
            setOverflowVisible(false)
        }
        else {
            setTimeout(() => {
                setOverflowVisible(true)
            },300)
        }
    }, [expanded]);

    useEffect(()=>{
        setSceneAttributes(scene.attributes as AnySceneAttribute[])
    }, [scene.attributes]);

    const deleteScene = async () => {
        if(!await confirm({message: `Scene #${position+1} and all of its shots will be lost forever. You cannot undo this.`, buttons: {confirm: {className: "bad"}}})) return

        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteScene($sceneId: String!) {
                    deleteScene(id: $sceneId) {
                        id
                    }
                }
            `,
            variables: { sceneId: scene.id },
        });

        if(errors) {
            console.error(errors)
        }
        else{
            onDelete(scene.id as string)
        }
    }

    if(!scene || !scene.id) return (<p>scene not found</p>)

    return (
        <div
            className={`sidebarScene ${expanded ? 'expanded' : ''} ${isBeingEdited && "active"}`}
            onClick={() => {onSelect(scene.id as string)}}
            ref={setNodeRef}
            style={style}
        >
            <div className="name">
                <p className="number">{position + 1}</p>
                <p className="text">{
                    sceneAttributes.every(attr => SceneAttributeParser.isEmpty(attr))
                        ? "New Scene"
                        : sceneAttributes
                            .filter(attr => !SceneAttributeParser.isEmpty(attr))
                            .map(attr => SceneAttributeParser.toValueString(attr))
                            .join(" • ")
                }</p>
                <Popover.Root onOpenChange={setIsBeingEdited}>
                    <Tooltip.Root open={tooltipVisible} onOpenChange={(newOpen) => {if(!shotlistContext.elementIsBeingDragged) setTooltipVisible(newOpen)}}>
                        <Popover.Trigger
                            className="grip"
                            ref={setActivatorNodeRef}
                            {...listeners}
                            {...attributes}
                            onClick={e => e.stopPropagation()}
                        >
                            <Tooltip.Trigger className={"noPadding"} asChild>
                                <GripVertical size={expanded ? 22 : 20}/>
                            </Tooltip.Trigger>
                        </Popover.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className={"TooltipContent"}>
                                <Tooltip.Arrow/>
                                <p><span className="bold">Click</span> to edit</p>
                                <p><span className="bold">Drag</span> to reorder</p>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                    <Popover.Portal>
                        <Popover.Content className="PopoverContent sceneContextOptionsPopup" align={"start"} side={"right"} sideOffset={12} alignOffset={-10}>
                            <button className={"bad"} onClick={(e) => {e.stopPropagation(); deleteScene()}}><Trash size={18}/> delete</button>
                            <Separator.Root className="Separator"/>
                            <button onClick={() => shotlistContext.openShotlistOptionsDialog({main: "attributes", sub: "scene"})}><List size={18}/> Edit scene attributes</button>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>

            <Collapsible.Root open={expanded}>
                <Collapsible.Content
                    className="CollapsibleContent"
                    style={{overflow: overflowVisible ? "visible" : "hidden",}}
                >
                    <div className="attributes">
                        {sceneAttributes.length == 0 ? <p className={"empty"}>No attributes defined</p> :sceneAttributes.map((attr, index) => (
                            <SceneAttribute
                                key={attr.id}
                                attribute={attr}
                                attributeUpdated={(attribute: AnySceneAttribute) => {
                                    let newAttributes = [...sceneAttributes]
                                    newAttributes[index] = attribute
                                    setSceneAttributes(newAttributes)
                                }}
                            ></SceneAttribute>
                        ))}
                    </div>

                    {/*<button className={"delete"} onClick={deleteScene}>delete scene <Trash size={16} strokeWidth={3}/></button>*/}
                </Collapsible.Content>
            </Collapsible.Root>

            {ConfirmDialog}
        </div>
    );
}
