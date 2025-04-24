'use client'

import {ShotDto, Shotlist} from "../../../lib/graphql/generated"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import {AnyShotAttribute} from "@/util/Types"
import {wuText} from "@yanikkendler/web-utils"
import './shot.scss'
import {GripVertical} from "lucide-react"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';

export default function Shot({shot, dndTarget, position}: {shot: ShotDto, dndTarget: boolean, position: number}) {
    // @ts-ignore
    const {
        attributes,
            listeners,
            setNodeRef,
            setActivatorNodeRef,
            transform,
            transition,
    } = useSortable({id: shot.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div className={`shot ${dndTarget && "dndTarget"}`} ref={setNodeRef} style={style}>
            <div
                className="grip"
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
            >
                <GripVertical/>
            </div>
            <div className="shotAttribute number">
                <p>{wuText.numberToLetter(position)}</p>
            </div>
            {(shot.attributes as [AnyShotAttribute])?.map((attr) => (
                <ShotAttribute attribute={attr} key={attr.id}></ShotAttribute>
            ))}
        </div>
    );
}
