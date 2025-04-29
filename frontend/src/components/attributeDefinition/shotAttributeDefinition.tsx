'use client'

import {AnyShotAttribute, AnyShotAttributeDefinition} from "@/util/Types"
import './shotAttributeDefinition.scss'
import {GripVertical} from "lucide-react"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';
import {ShotAttributeDefinitionParser} from "@/util/AttributeParser"

export default function ShotAttributeDefinition({attribute}: {attribute: AnyShotAttributeDefinition}) {
    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: attribute.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = ShotAttributeDefinitionParser.toIcon(attribute);

    return (
        <div className={"shotAttributeDefinition"} ref={setNodeRef} style={style}>
            <div
                className="grip"
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
            >
                <GripVertical/>
            </div>
            <Icon/>
            <input type="text" defaultValue={attribute.name || ""}/>
        </div>
    );
}
