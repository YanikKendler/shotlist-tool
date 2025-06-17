'use client'

import {useApolloClient, useQuery} from "@apollo/client"
import gql from "graphql-tag"
import Shot from "@/components/shot/shot"
import "./shotTable.scss"
import {SceneDto, ShotAttributeDefinitionBase} from "../../../lib/graphql/generated"
import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from "react"
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
import {ShotAttributeDefinitionParser} from "@/util/AttributeParser"
import {AnyShotAttributeDefinition} from "@/util/Types"
import {restrictToVerticalAxis} from "@dnd-kit/modifiers"
import {ShotlistContext} from "@/context/ShotlistContext"

export type ShotTableRef = {
    refresh: () => void;
};

const ShotTable = forwardRef(({sceneId, shotAttributeDefinitions, readOnly}: {sceneId: string, shotAttributeDefinitions: ShotAttributeDefinitionBase[], readOnly: boolean}, ref) => {
    const shotTableElement = useRef<HTMLDivElement | null>(null)
    const [shots, setShots] = useState<{data: any[], loading: boolean, error: any}>({data: [], loading: true, error: null})
    const [focusAttributeAt, setFocusAttributeAt] = useState<number>(-1)

    const client = useApolloClient()

    const shotlistContext = useContext(ShotlistContext)

    useEffect(() => {
        if(sceneId != "")
            loadShots()
    }, [sceneId]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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
    }, [shots])

    const loadShots = async () => {
        console.time("loadShots-"+sceneId)
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
        console.timeEnd("loadShots-"+sceneId)

        setShots({data: data.shots, loading: loading, error: errors})
    }

    const createShot = async (attributePosition: number) => {
        console.time("createShot")
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
        console.timeEnd("createShot")

        if (errors) {
            console.error(errors);
            return;
        }

        setFocusAttributeAt(attributePosition+1)

        setShots({data: [...shots.data, data.createShot], error: shots.error, loading: shots.loading})
    }

    const removeShot = (shotId: string) => {
        if(!shots) return

        let currentShots = shots.data
        let newShots= currentShots.filter((shot) => shot.id != shotId)

        setShots({
            ...shots,
            data: newShots
        })
    }

    function handleDragEnd(event: any) {
        shotlistContext.setElementIsBeingDragged(false)

        const {active, over} = event;

        if (active.id !== over.id) {
            setShots((shots) => {
                const oldIndex = shots.data.findIndex((shot) => shot.id === active.id);
                const newIndex = shots.data.findIndex((shot) => shot.id === over.id);

                ShotService.updateShot(active.id, newIndex).then(response => {
                    if(response.errors) console.error(response.errors)
                })

                return {data: arrayMove(shots.data, oldIndex, newIndex), error: shots.error, loading: shots.loading};
            });
        }
    }

    if(!sceneId || sceneId == "") return <div className="shotTable"><p className={"error"}>No Scene selected</p></div>
    if(shots.loading) return <div className="shotTable"><p className={"error"}>loading...</p></div>
    if (shots.error) {
        console.error(shots.error)
        return <div className="shotTable"><p className={"error"}>failed to load shots</p></div>
    }

    return (
        <div className="shotTable" ref={shotTableElement}>
            {
                shotAttributeDefinitions.length == 0 ?
                <div className={"empty"}>
                    No shots to display. Start by:
                    <button disabled={readOnly} onClick={() => shotlistContext.openShotlistOptionsDialog({main: "attributes", sub: "shot"})}>defining a shot attribute</button>
                </div> :
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={() => {
                            shotlistContext.setElementIsBeingDragged(true)
                        }}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={shots.data.map(shot => shot.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {shots.data.map((shot: any, index) => (
                                <Shot shot={shot} key={shot.id} position={index} onDelete={removeShot} readOnly={readOnly}/>
                            ))}
                        </SortableContext>
                    </DndContext>
                    {
                        !readOnly &&
                        <div className="shot new">
                            <div className="shotAttribute number first">
                                <span>#</span>
                            </div>
                            {shotAttributeDefinitions.map((shotAttributeDefinition, index) => {
                                let Icon = ShotAttributeDefinitionParser.toIcon(shotAttributeDefinition as AnyShotAttributeDefinition)
                                return (
                                    <div
                                        className={`shotAttribute ${index == shotAttributeDefinitions.length - 1 ? "last" : ""}`}
                                        key={shotAttributeDefinition.id}
                                        onClick={() => createShot(index)}>
                                        <p>{shotAttributeDefinition.name || "Unnamed"}</p>
                                        <div className="icon">
                                            <Icon size={18}/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </>
            }
        </div>
    )
})

export default ShotTable
