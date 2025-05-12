'use client'

import {ShotDto} from "../../../lib/graphql/generated"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import {AnyShotAttribute} from "@/util/Types"
import {wuText} from "@yanikkendler/web-utils"
import './shot.scss'
import {ArrowDownRight, CornerDownRight, GripVertical, NotepadText, Trash} from "lucide-react"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';
import {Popover} from "radix-ui"
import React, {useState} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"

export default function Shot({shot, position, onDelete}: {shot: ShotDto, position: number, onDelete: (shotId: string) => void}) {
    const [isBeingEdited, setIsBeingEdited] = useState(false);

    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: shot.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const client = useApolloClient()

    const numberToShotLetter = (number: number) => {
        let result = wuText.numberToLetter(number)
        for (let i = 0; i < Math.floor(number / 26); i++) {
            result += wuText.numberToLetter(number)
        }
        return result;
    }

    async function deleteShot(){
        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteShot($shotId: String!) {
                    deleteShot(id: $shotId) {
                        id
                    }
                }
            `,
            variables: { shotId: shot.id },
        });

        if(errors) {
            console.error(errors)
        }
        else{
            onDelete(shot.id as string)
        }
    }

    return (
        <div className={`shot ${isBeingEdited && "active"}`} ref={setNodeRef} style={style}>
            <Popover.Root onOpenChange={setIsBeingEdited}>
                <Popover.Trigger
                    className="grip"
                     ref={setActivatorNodeRef}
                     {...listeners}
                     {...attributes}
                >
                    <GripVertical/>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className="PopoverContent shotContextOptionsPopup" align={"start"}>
                        <button disabled={true}><CornerDownRight size={18}/> make subshot</button>
                        <button disabled={true}><NotepadText size={18}/> notes</button>
                        <button className={"bad"} onClick={deleteShot}><Trash size={18}/> delete</button>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            <div className="shotAttribute first number">
                <p>{numberToShotLetter(position)}</p>
            </div>
            {(shot.attributes as [AnyShotAttribute])?.map((attr, index) => (
                <ShotAttribute className={index == shot.attributes!.length-1 ? "last" : ""} attribute={attr} key={attr.id}></ShotAttribute>
            ))}
        </div>
    );
}
