'use client'

import {AnyShotAttribute, AnyShotAttributeDefinition} from "@/util/Types"
import './shotAttributeDefinition.scss'
import {GripVertical, Pencil, Trash} from "lucide-react"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from '@dnd-kit/utilities';
import {ShotAttributeDefinitionParser} from "@/util/AttributeParser"
import gql from "graphql-tag"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import {useApolloClient} from "@apollo/client"

export default function ShotAttributeDefinition({definition, onDelete}: {definition: AnyShotAttributeDefinition, onDelete: (id: number) => void}) {
    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: definition.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = ShotAttributeDefinitionParser.toIcon(definition);

    const { confirm, ConfirmDialog } = useConfirmDialog();
    const client = useApolloClient()

    const deleteDefinition = async () => {
        if(!await confirm({
            message: `The attribute definition "${definition.name}" will be deleted. All scenes in this shotlist will lose the column "${definition.name}" and with that: all the values in that column.`,
            buttons: {confirm: {className: "bad"}}}
        )) return

        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteShotAttributeDefinition($definitionId: BigInteger!) {
                    deleteShotAttributeDefinition(id: $definitionId) {
                        id
                    }
                }
            `,
            variables: { definitionId: definition.id },
        });

        if(errors) {
            console.error(errors)
        }
        else{
            onDelete(definition.id)
        }
    }

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
            <Icon size={20} strokeWidth={3}/>
            <input type="text" defaultValue={definition.name || ""}/>
            <button className="edit">edit options <Pencil size={16}/></button>
            <button className="delete" onClick={deleteDefinition}><Trash size={18}/></button>
            {ConfirmDialog}
        </div>
    );
}
