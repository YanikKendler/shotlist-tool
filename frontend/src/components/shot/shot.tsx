'use client'

import {ShotDto, Shotlist} from "../../../lib/graphql/generated"
import ShotAttribute from "@/components/shotAttribute/shotAttribute"
import {AnyShotAttribute} from "@/util/Types"
import {wuText} from "@yanikkendler/web-utils"
import styles from './shot.module.scss'

export default function Shot({shot}: {shot: ShotDto}) {
  return (
    <div className={styles.shot}>
        <p>{wuText.numberToLetter(shot.number)}</p>
        {(shot.attributes as [AnyShotAttribute])?.map((attr) => (
            <ShotAttribute attribute={attr} key={attr.id}></ShotAttribute>
        ))}
    </div>
  );
}
