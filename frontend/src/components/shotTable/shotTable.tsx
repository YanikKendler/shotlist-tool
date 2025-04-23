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

export default function ShotTable({sceneId, shotAttributeDefinitions}: {sceneId: string, shotAttributeDefinitions: ShotAttributeDefinitionBase[]}) {
    const shotTableElement = useRef<HTMLDivElement | null>(null)
    const [activeId, setActiveId] = useState(null);
    const [overId, setOverId] = useState(null);
    const [shots, setShots] = useState<{data: any[], loading: boolean, error: any}>({data: [], loading: true, error: null})

    useEffect(() => {
        console.log("loading shots")
        loadShots()
    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const client = useApolloClient()

    const loadShots = async () => {
        const { data, errors, loading } = await client.query({
            query : gql`
                query shots($sceneId: String!){
                    shots(sceneId: $sceneId){
                        id
                        number
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
        })

        setShots({data: data.shots, loading: loading, error: errors})
    }

    const createShot = async (attributePosition: number) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation create($sceneId: String!) {
                    createShot(sceneId: $sceneId){
                        id
                    }
                }
            `,
            variables: { sceneId: sceneId },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        await loadShots()

        if(shotTableElement.current && shotTableElement.current instanceof HTMLElement)
            console.log(shotTableElement.current.querySelectorAll(".shot:not(.new)").values().toArray().at(-1))
    }

    if(shots.error) return <div>loading..</div>
    if(shots.error) {
        console.error(shots.error)
        return <div>shotTable error: {shots.error.name}, message: {shots.error.message}</div>
    }

    function handleDragStart(event: any) {
        const {active} = event;

        setActiveId(active.id);
    }

    function handleDragOver(event: any) {
        setOverId(event.over?.id ?? null);
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;

        console.log("dragEnd", active, over)

        if (active.id !== over.id) {
            setShots((shots) => {
                const oldIndex = shots.data.findIndex((shot) => shot.id === active.id);
                const newIndex = shots.data.findIndex((shot) => shot.id === over.id);

                console.log(oldIndex, newIndex)

                return {data: arrayMove(shots.data, oldIndex, newIndex), error: shots.error, loading: shots.loading};
            });
        }

        console.log(shots)

        setActiveId(null);
        setOverId(null);
    }

    return (
        <div className="shotTable" ref={shotTableElement}>
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={shots.data}
                    strategy={verticalListSortingStrategy}
                >
                    {shots.data.map((shot: any) => (
                        <Shot shot={shot} key={shot.id}/>
                    ))}
                </SortableContext>
                <DragOverlay>
                    {activeId ? <p>hallo welt</p> : null}
                </DragOverlay>
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
