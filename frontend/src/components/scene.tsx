'use client'

import {SceneAttributeParser} from "@/util/AttributeParser"
import {SceneDto} from "../../lib/graphql/generated"

export default function Scene({scene}: {scene: SceneDto}){
    return (
        <>
            <p>{scene.number+1}</p>
            <p>{scene.attributes?.map(attr => SceneAttributeParser.toValueString(attr as any)).join(" • ")}</p>
        </>
    );
}
