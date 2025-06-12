import {
    SceneSelectAttributeOptionDefinition,
    ShotAttributeTemplateBaseDto,
    ShotSelectAttributeOptionDefinition
} from "../../../lib/graphql/generated"
import {Grip, GripVertical, Pencil, Plus, Trash} from "lucide-react"
import {useEffect, useState} from "react"
import {
    AnyShotAttributeTemplate,
    SceneSingleOrMultiSelectAttributeDefinition
} from "@/util/Types"
import {useSortable} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"
import {ShotAttributeTemplateParser} from "@/util/AttributeParser"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import {useApolloClient} from "@apollo/client"
import gql from "graphql-tag"
import {wuGeneral} from "@yanikkendler/web-utils/dist"
import {Popover} from "radix-ui"
import "./shotAttributeTemplate.scss"
import Input from "@/components/input/input"

export default function ShotAttributeTemplate({attributeTemplate, onDelete}: { attributeTemplate: ShotAttributeTemplateBaseDto, onDelete: (id: number) => void }) {
    const [attribute, setAttribute] = useState<AnyShotAttributeTemplate>({} as AnyShotAttributeTemplate)

    // @ts-ignore
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} = useSortable({id: attributeTemplate.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = ShotAttributeTemplateParser.toIcon(attribute);

    const { confirm, ConfirmDialog } = useConfirmDialog();
    const client = useApolloClient()

    useEffect(() => {
        setAttribute(attributeTemplate)
    }, [attributeTemplate])

    async function updateDefinition(newName: string) {
        const {data, errors} = await client.mutate({
            mutation: gql`
                mutation updateShotAttributeTemplateName($id: BigInteger!, $name: String!) {
                    updateShotAttributeTemplate(editDTO: {
                        id: $id
                        name: $name
                    }){ id }
                }
            `,
            variables: {id: attribute.id, name: newName},
        });
        if (errors) {
            console.error(errors)
        }

        setAttribute({
            ...attribute,
            name: newName
        })
    }

    const debouncedUpdateDefinition = wuGeneral.debounce(updateDefinition)

    const deleteAttributeTemplate = async () => {
        if(!await confirm({
            message: `The attribute definition "${attribute.name || 'unnamed'}" will be deleted. This will not affect any existing shotlists or their shots.`,
            buttons: {confirm: {className: "bad"}}}
        )) return

        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteShotAttributeTemplate($definitionId: BigInteger!) {
                    deleteShotAttributeTemplate(id: $definitionId) {
                        id
                    }
                }
            `,
            variables: { definitionId: attribute.id },
        });

        if(errors) {
            console.error(errors)
        }
        else{
            onDelete(attribute.id)
        }
    }

    const createSelectOption = async () => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation createSceneSelectAttributeOption($definitionId: BigInteger!) {
                    createSceneSelectAttributeOption(createDTO: {
                        attributeDefinitionId: $definitionId
                    }) {
                        id
                        name
                    }
                }
            `,
            variables: { definitionId: attribute.id },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        let currentOptions = (attribute as SceneSingleOrMultiSelectAttributeDefinition).options as SceneSelectAttributeOptionDefinition[]
        let newOptions: SceneSelectAttributeOptionDefinition[] = []
        if(currentOptions) newOptions = [...currentOptions]
        newOptions.push(data.createSceneSelectAttributeOption)

        /*setAttribute({
            ...attribute,
            options: newOptions
        })*/
    }

    const deleteSelectOption = async (optionId: number) => {
        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteSceneSelectAttributeOption($optionId: BigInteger!) {
                    deleteSceneSelectAttributeOption(id: $optionId) {
                        id
                    }
                }
            `,
            variables: { optionId: optionId },
        });

        if(errors) {
            console.error(errors)
        }

        let newOptions: SceneSelectAttributeOptionDefinition[] = (attribute as SceneSingleOrMultiSelectAttributeDefinition)?.options?.filter(option => option?.id != optionId) as SceneSelectAttributeOptionDefinition[] || []

        /*setAttribute({
            ...attribute,
            options: newOptions
        })*/
    }

    const updateOptionName = async (optionId: number, newName: string) => {
        const {data, errors} = await client.mutate({
            mutation : gql`
                mutation updateSceneSelectAttributeOption($id: BigInteger!, $name: String!) {
                    updateSceneSelectAttributeOption(editDTO: {
                        id: $id
                        name: $name
                    }){ id }
                }
            `,
            variables: {id: optionId, name: newName},
        });
        if(errors) {
            console.error(errors)
        }

        let currentOptions = (attribute as SceneSingleOrMultiSelectAttributeDefinition).options as SceneSelectAttributeOptionDefinition[]
        let newOptions: SceneSelectAttributeOptionDefinition[] = currentOptions.map(option => {
            if(option.id == optionId) {
                return {
                    ...option,
                    name: newName
                }
            }
            return option
        })

        /*setAttribute({
            ...attribute,
            options: newOptions
        })*/
    }

    const debouncedUpdateOptionName = wuGeneral.debounce(updateOptionName)

    return (
        <div className={"shotAttributeTemplate"} ref={setNodeRef} style={style}>
            <div
                className="grip"
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
            >
                <GripVertical/>
            </div>
            <Icon size={20} strokeWidth={3}/>
            <Input
                defaultValue={attribute.name || ""}
                valueChange={debouncedUpdateDefinition}
                placeholder={"Attribute name"}
                inputClass={"nameInput"}
            />
            {(attribute.__typename == "ShotMultiSelectAttributeTemplateDTO" || attribute.__typename == "ShotSingleSelectAttributeTemplateDTO") && (
                <Popover.Root>
                    <Popover.Trigger className={"editOptions"}>Edit options <Pencil size={16}/></Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="PopoverContent editAttributeOptionsPopup" sideOffset={5}
                                         align={"start"}>
                            {(attribute.options as ShotSelectAttributeOptionDefinition[])?.map((option, index) => (
                                <div className="option" key={option.id}>
                                    <p>{index + 1}</p>
                                    <input
                                        type="text"
                                        defaultValue={option.name || ""}
                                        placeholder="Option name"
                                        onInput={(event) => debouncedUpdateOptionName(option.id, event.currentTarget.value)}
                                    />
                                    <button className="bad" onClick={() => deleteSelectOption(option.id)}><Trash
                                        size={18}/></button>
                                </div>
                            ))}
                            <button onClick={createSelectOption}><Plus size={18}/>Add option</button>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            )}
            <button className="delete" onClick={deleteAttributeTemplate}><Trash size={18}/></button>
            {ConfirmDialog}
        </div>
    );
}