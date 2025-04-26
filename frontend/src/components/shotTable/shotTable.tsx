'use client'

import {useApolloClient, useQuery} from "@apollo/client"
import gql from "graphql-tag"
import Shot from "@/components/shot/shot"
import "./shotTable.scss"
import {ShotAttributeDefinitionBase} from "../../../lib/graphql/generated"
import React, {useEffect, useRef, useState} from "react"
import {ScrollArea} from "radix-ui"
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor, rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"
import ShotService from "@/service/ShotService"

export default function ShotTable({sceneId, shotAttributeDefinitions}: {sceneId: string, shotAttributeDefinitions: ShotAttributeDefinitionBase[]}) {
    const shotTableElement = useRef<HTMLDivElement | null>(null)
    const [activeId, setActiveId] = useState(null);
    const [shots, setShots] = useState<{data: any[], loading: boolean, error: any}>({data: [], loading: true, error: null})
    const [focusAttributeAt, setFocusAttributeAt] = useState<number>(-1)

    const client = useApolloClient()

    useEffect(() => {
        if(sceneId != "")
            loadShots()
    }, [sceneId]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if(focusAttributeAt < 0) return

        if(shotTableElement.current && shotTableElement.current instanceof HTMLElement) {
            let allShots = shotTableElement.current.querySelectorAll(".shot:not(.new)").values().toArray()
            let newShotElement = allShots.at(-1) as HTMLElement
            let attributeElement = newShotElement?.querySelectorAll(".shotAttribute").values().toArray().at(focusAttributeAt) as HTMLElement
            attributeElement.querySelector("input")?.focus()
            attributeElement.querySelector("p")?.focus()
        }

        setFocusAttributeAt(-1)
    }, [shots]);

    const loadShots = async () => {
        const { data, errors, loading } = await client.query({
            query : gql`
                query shots($sceneId: String!){
                    shots(sceneId: $sceneId){
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
            `,
            variables: { sceneId: sceneId },
            fetchPolicy: "no-cache",
        })

        console.log(data.shots)

        setShots({data: data.shots, loading: loading, error: errors})
    }

    const createShot = async (attributePosition: number) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation createShot($sceneId: String!) {
                    createShot(sceneId: $sceneId){
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
            `,
            variables: { sceneId: sceneId },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        setFocusAttributeAt(attributePosition+1)

        setShots({data: [...shots.data, data.createShot], error: shots.error, loading: shots.loading})
    }

    if(!sceneId || sceneId == "") return <div className="shotTable"><p className={"error"}>No Scene selected</p></div>
    if(shots.loading) return <div className="shotTable"><p className={"error"}>loading...</p></div>
    if (shots.error) {
        console.error(shots.error)
        return <div className="shotTable"><p className={"error"}>shotTable error: {shots.error.name}, message: {shots.error.message}</p></div>
    }

    function handleDragStart(event: any) {
        const {active} = event;

        setActiveId(active.id);
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setShots((shots) => {
                const oldIndex = shots.data.findIndex((shot) => shot.id === active.id);
                const newIndex = shots.data.findIndex((shot) => shot.id === over.id);

                ShotService.updateShot(active.id, newIndex).then(response => {
                    if(response.errors) console.error(response.errors)
                    console.log(response.data)
                })

                return {data: arrayMove(shots.data, oldIndex, newIndex), error: shots.error, loading: shots.loading};
            });
        }

        setActiveId(null);
    }

    return (
        <div className="shotTable" ref={shotTableElement}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={shots.data}
                    strategy={verticalListSortingStrategy}
                >
                    {shots.data.map((shot: any, index) => (
                        <Shot shot={shot} key={shot.id} dndTarget={false} position={index}/>
                    ))}
                </SortableContext>
                {/*<DragOverlay>
                    {activeId ? <p>hallo welt</p> : null}
                </DragOverlay>*/}
            </DndContext>

            <div className="shot new">
                <div className="shotAttribute number">
                    <span>#</span>
                </div>
                {shotAttributeDefinitions.map((shotAttributeDefinition, index) => (
                    <div className="shotAttribute" key={shotAttributeDefinition.id} onClick={() => createShot(index)}>
                        <p>{shotAttributeDefinition.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
