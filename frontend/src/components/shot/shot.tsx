'use client'

import {ShotDto, Shotlist} from "../../../lib/graphql/generated"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import {AnyShotAttribute} from "@/util/Types"
import {wuText} from "@yanikkendler/web-utils"
import './shot.scss'
import {GripVertical} from "lucide-react"

export default function Shot({shot}: {shot: ShotDto}) {
  return (
    <div className="shot">
        <div className="grip">
            <GripVertical/>
        </div>
        <div className="shotAttribute number">
            <p>{wuText.numberToLetter(shot.number)}</p>
        </div>
        {(shot.attributes as [AnyShotAttribute])?.map((attr) => (
            <ShotAttribute attribute={attr} key={attr.id}></ShotAttribute>
        ))}
    </div>
  );
}
