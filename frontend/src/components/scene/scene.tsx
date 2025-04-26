'use client'

import {SceneAttributeParser} from "@/util/AttributeParser"
import {SceneDto} from "../../../lib/graphql/generated"
import "./scene.scss"
import {useEffect, useState} from "react"
import { Collapsible } from "radix-ui"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import SceneAttribute from "@/components/sceneAttribute/sceneAttribute"
import {AnySceneAttribute, AnyShotAttribute} from "@/util/Types"
import {Trash} from "lucide-react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import {useConfirmDialog} from "@/components/confirmDialog/confirmDialoge"

export default function Scene({scene, position, expanded, onSelect, onDelete}: {scene: SceneDto, position:number, expanded: boolean, onSelect: ( id: string) => void, onDelete: ( id: string) => void}) {
    const [overflowVisible, setOverflowVisible] = useState(false);
    const [sceneTitle, setSceneTitle] = useState<string>("")

    const { confirm, ConfirmDialog } = useConfirmDialog();

    const client = useApolloClient()

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

    useEffect(() => {
        if(!scene.attributes) return
        if(scene.attributes.length === 0) return

        if(scene.attributes.every(attr => SceneAttributeParser.isEmpty(attr as any)))
            setSceneTitle("New Scene")
        else
            setSceneTitle(scene.attributes.map(attr => SceneAttributeParser.toValueString(attr as any)).join(" • ") || "New Scene")
    }, [scene.attributes]);

    const deleteScene = async () => {
        if(!await confirm({message: `The scene "${sceneTitle}" and all of its shots will be lost forever.`, buttons: {confirm: {className: "bad"}}})) return

        const { errors } = await client.mutate({
            mutation: gql`
                mutation createShotOption($sceneId: String!) {
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
        <div className={`sidebarScene ${expanded ? 'expanded' : ''}`} onClick={() => {onSelect(scene.id as string)}}>
            <div className="name">
                <p className="number">{position+1}</p>
                <p className="text">{sceneTitle}</p>
            </div>

            <Collapsible.Root open={expanded}>
                <Collapsible.Content
                    className="CollapsibleContent"
                    style={{ overflow: overflowVisible ? "visible" : "hidden",}}
                >
                    {(scene.attributes as [AnySceneAttribute])?.map(attr => (
                        <SceneAttribute attribute={attr} key={attr.id}></SceneAttribute>
                    ))}
                    <button className={"delete"} onClick={deleteScene}>delete scene <Trash size={16} strokeWidth={3}/></button>
                </Collapsible.Content>
            </Collapsible.Root>

            {ConfirmDialog}
        </div>
    );
}
