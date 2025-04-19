'use client'

import {SceneAttributeParser} from "@/util/AttributeParser"
import {SceneDto} from "../../../lib/graphql/generated"
import "./scene.scss"
import {useState} from "react"
import { Collapsible } from "radix-ui"

export default function Scene({scene, expanded, onSelect}: {scene: SceneDto, expanded: boolean, onSelect: ( id: string) => void}) {
    if(!scene || !scene.id) return (<p>scene not found</p>)

    return (
        <div className={`sidebarScene ${expanded ? 'expanded' : ''}`} onClick={() => {onSelect(scene.id as string)}}>
            <div className="name">
                <p className="number">{scene.number+1}</p>
                <p className="text">{scene.attributes?.map(attr => SceneAttributeParser.toValueString(attr as any)).join(" • ")}</p>
            </div>

            <Collapsible.Root open={expanded}>
                <Collapsible.Content className="CollapsibleContent">
                    {scene.attributes?.map(attr => (
                        <p key={attr?.id}>attribute</p>
                    ))}
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
}
