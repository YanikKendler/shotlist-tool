'use client'

import {SceneAttributeParser} from "@/util/AttributeParser"
import {SceneDto} from "../../../lib/graphql/generated"
import "./scene.scss"
import {useEffect, useState} from "react"
import { Collapsible } from "radix-ui"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import SceneAttribute from "@/components/sceneAttribute/sceneAttribute"
import {AnySceneAttribute, AnyShotAttribute} from "@/util/Types"

export default function Scene({scene, expanded, onSelect}: {scene: SceneDto, expanded: boolean, onSelect: ( id: string) => void}) {
    const [overflowVisible, setOverflowVisible] = useState(false);

    useEffect(() => {
        if (!expanded) {
            setOverflowVisible(false); // Immediately hide overflow before closing animation
        }
        else {
            setTimeout(() => {
                setOverflowVisible(true); // Show overflow after the opening animation
            },300)
        }
    }, [expanded]);

    if(!scene || !scene.id) return (<p>scene not found</p>)

    return (
        <div className={`sidebarScene ${expanded ? 'expanded' : ''}`} onClick={() => {onSelect(scene.id as string)}}>
            <div className="name">
                <p className="number">{scene.number+1}</p>
                <p className="text">{scene.attributes?.map(attr => SceneAttributeParser.toValueString(attr as any)).join(" • ")}</p>
            </div>

            <Collapsible.Root open={expanded}>
                <Collapsible.Content
                    className="CollapsibleContent"
                    style={{ overflow: overflowVisible ? "visible" : "hidden",}}
                >
                    {(scene.attributes as [AnySceneAttribute])?.map(attr => (
                        <SceneAttribute attribute={attr} key={attr.id}></SceneAttribute>
                    ))}
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
}
