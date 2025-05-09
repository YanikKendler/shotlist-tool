'use client'

import {ShotDto, Shotlist} from "../../../lib/graphql/generated"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import {AnyShotAttribute} from "@/util/Types"
import {wuText} from "@yanikkendler/web-utils"
import './shot.scss'
import {GripVertical} from "lucide-react"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';

export default function Shot({shot, position}: {shot: ShotDto, position: number}) {
    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: shot.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const numberToShotLetter = (number: number) => {
        let result = wuText.numberToLetter(number)
        for (let i = 0; i < Math.floor(number / 26); i++) {
            result += wuText.numberToLetter(number)
        }
        return result;
    }

    return (
        <div className={"shot"} ref={setNodeRef} style={style}>
            <div
                className="grip"
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
            >
                <GripVertical/>
            </div>
            <div className="shotAttribute first number">
                <p>{numberToShotLetter(position)}</p>
            </div>
            {(shot.attributes as [AnyShotAttribute])?.map((attr, index) => (
                <ShotAttribute className={index == shot.attributes!.length-1 ? "last" : ""} attribute={attr} key={attr.id}></ShotAttribute>
            ))}
        </div>
    );
}
