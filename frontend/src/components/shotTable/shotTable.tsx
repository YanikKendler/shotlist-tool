'use client'

import {useApolloClient, useQuery} from "@apollo/client"
import gql from "graphql-tag"
import Shot from "@/components/shot/shot"
import "./shotTable.scss"
import {ShotAttributeDefinitionBase} from "../../../lib/graphql/generated"
import React, {useRef, useState} from "react"
import {ScrollArea} from "radix-ui"
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable"

export default function ShotTable({sceneId, shotAttributeDefinitions}: {sceneId: string, shotAttributeDefinitions: ShotAttributeDefinitionBase[]}) {
    const shotTableElement = useRef<HTMLDivElement>(null)
    const [activeId, setActiveId] = useState(null);
    const [shots, setShots] = useState([])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const client = useApolloClient()

    const loadShots = async () => {
        const { data } = await client.query({
            query: gql`
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
                }`,
            { variables: {sceneId: sceneId} }
        });
    }

    const { loading, error, data, refetch } = useQuery(gql`
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
        }`,
{ variables: {sceneId: sceneId} }
    )

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

        await refetch()

        if(shotTableElement.current)
            console.log(shotTableElement.current.querySelectorAll(".shot:not(.new)").values().toArray().at(-1))
    }

    if(loading) return <div>loading..</div>
    if(error) {
        console.error(error)
        return <div>shotTable error: {error.name}, message: {error.message}</div>
    }

    function handleDragStart(event: any) {
        const {active} = event;

        setActiveId(active.id);
    }

    function handleDragEnd(event: any) {
        const {active, over} = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
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
                    items={data.shots}
                    strategy={verticalListSortingStrategy}
                >
                    {data.shots.map((shot: any) => (
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
