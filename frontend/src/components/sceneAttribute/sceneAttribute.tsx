'use client'

import {
    AnySceneAttribute,
    AnyShotAttribute,
    ShotAttributeValueCollection,
    SelectOption,
    SceneAttributeValueCollection
} from "@/util/Types"
import React, {
    useCallback, useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import './sceneAttribute.scss'
import {useSelectRefresh} from "@/context/SelectRefreshContext"
import {wuConstants, wuGeneral, wuText} from "@yanikkendler/web-utils"
import Select, {selectSceneStyles} from "@/components/select/select"
import {ShotlistContext} from "@/context/ShotlistContext"
import {ChevronDown, List, Type} from "lucide-react"
import {SceneSingleSelectAttributeDto} from "../../../lib/graphql/generated"

const SceneAttribute = function SceneAttribute({attribute, attributeUpdated}: {attribute: AnySceneAttribute, attributeUpdated: (attribute: AnySceneAttribute) => void}) {
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption>();
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>();
    const [textValue, setTextValue] = useState<string>("");

    const textInputRef = useRef<HTMLParagraphElement>(null);

    const { refreshMap, triggerRefresh } = useSelectRefresh();

    const client = useApolloClient()

    const shotlistContext = useContext(ShotlistContext)

    useEffect(() => {
        if (!attribute) return;

        switch (attribute.__typename) {
            case "SceneSingleSelectAttributeDTO":
                if(attribute.singleSelectValue === null) return
                setSingleSelectValue({
                    label: attribute.singleSelectValue?.name || "",
                    value: attribute.singleSelectValue?.id || "",
                })
                break
            case "SceneMultiSelectAttributeDTO":
                if(attribute.multiSelectValue === null || attribute.multiSelectValue?.length == 0) return
                setMultiSelectValue(attribute.multiSelectValue?.map(
                    (option) => {
                        return {
                            label: option?.name || "",
                            value: option?.id || "",
                        }
                    }
                ))
                break
            case "SceneTextAttributeDTO":
                if(textValue == "") setTextValue(attribute.textValue || "")
                break
        }
    }, [attribute]);

    useEffect(() => {
        if (textInputRef.current && textInputRef.current.textContent !== textValue) {
            textInputRef.current.textContent = textValue;
        }
    }, [textValue]);

    const loadOptions = async (inputValue: string) => {
        const { data } = await client.query({
            query: gql`
                query searchSceneSelectAttributeOptions($definitionId: BigInteger!, $searchTerm: String!) {
                    searchSceneSelectAttributeOptions(
                        searchDTO: { sceneAttributeDefinitionId: $definitionId, searchTerm: $searchTerm }
                    ) {
                        id
                        name
                    }
                }
            `,
            variables: { definitionId: attribute.definition?.id, searchTerm: inputValue},
            fetchPolicy: 'no-cache'
        });

        return data.searchSceneSelectAttributeOptions.map((option: any): SelectOption => ({
            value: option.id,
            label: option.name,
        }));
    }

    const createOption = async (inputValue: string) => {
        const { data } = await client.mutate({
            mutation: gql`
                mutation createSceneOption($definitionId: BigInteger!, $name: String!) {
                    createSceneSelectAttributeOption(createDTO:{
                        attributeDefinitionId: $definitionId,
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { definitionId: attribute.definition?.id, name: inputValue },
        });

        if(attribute.__typename == "SceneSingleSelectAttributeDTO")
            updateSingleSelectValue({
                label: data.createSceneSelectAttributeOption.name,
                value: data.createSceneSelectAttributeOption.id
            })
        if(attribute.__typename == "SceneMultiSelectAttributeDTO")
            updateMultiSelectValue([
                ...multiSelectValue || [],
                {
                    label: data.createSceneSelectAttributeOption.name,
                    value: data.createSceneSelectAttributeOption.id
                }
            ])

        triggerRefresh("shot", attribute.definition?.id);
    }

    const updateTextValue = () => {
        if(!textInputRef.current) return;

        // remove all newlines
        let cleaned = textInputRef.current.innerText.replace(/[\r\n]+/g, " ");

        textInputRef.current.innerText = cleaned;

        wuGeneral.moveCursorToEnd(textInputRef.current);

        setTextValue(cleaned)

        debouncedUpdateAttributeValue({textValue: cleaned})

        let newValue = {...attribute, textValue: cleaned}
        attributeUpdated(newValue)
    }

    const updateSingleSelectValue = (value: SelectOption | null) => {
        setSingleSelectValue(value || undefined)
        updateAttributeValue({singleSelectValue: Number(value?.value)})
        let newValue = {...attribute, singleSelectValue: {id: value?.value, name: value?.label}}
        attributeUpdated(newValue)
    }

    const updateMultiSelectValue = (value: SelectOption[] | null) => {
        setMultiSelectValue(value || [])
        updateAttributeValue({multiSelectValue: value?.map((option) => Number(option.value))})
        let newValue = {...attribute, multiSelectValue: value?.map((option) => ({id: option.value, name: option.label}))}
        attributeUpdated(newValue)
    }

    const updateAttributeValue = async (value: SceneAttributeValueCollection) => {
        const {data, errors} = await client.mutate({
            mutation : gql`
                mutation updateSceneAttribute($id: BigInteger!, $textValue: String, $singleSelectValue: BigInteger, $multiSelectValue: [BigInteger]) {
                    updateSceneAttribute(editDTO:{
                        id: $id
                        textValue: $textValue
                        singleSelectValue: $singleSelectValue
                        multiSelectValue: $multiSelectValue
                    }){
                        id
                    }
                }
            `,
            variables: {id: attribute.id, ...value},
        });
        if(errors) {
            console.error(errors)
        }
    }

    const debouncedUpdateAttributeValue = useMemo(() => wuGeneral.debounce(updateAttributeValue), []);

    let content: React.JSX.Element = <></>

    switch (attribute.__typename) {
        case "SceneSingleSelectAttributeDTO":
            content = (
                <>
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={false}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateSingleSelectValue(newValue as SelectOption)}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || "Unnamed"}
                        value={singleSelectValue}
                        shotOrScene={"scene"}
                        editAction={shotlistContext.openShotlistOptionsDialog}
                        styles={selectSceneStyles}
                    ></Select>
                    <div className="icon">
                        <ChevronDown size={18} strokeWidth={2}/>
                    </div>
                </>
            )
            break
        case "SceneMultiSelectAttributeDTO":
            content = (
                <>
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={true}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateMultiSelectValue(newValue as SelectOption[])}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || "Unnamed"}
                        value={multiSelectValue}
                        shotOrScene={"scene"}
                        editAction={shotlistContext.openShotlistOptionsDialog}
                        styles={selectSceneStyles}
                    ></Select>
                    <div className="icon">
                        <List size={18} strokeWidth={2}/>
                    </div>
                </>
            )
            break
        case "SceneTextAttributeDTO":
            content = (
                <>
                <div className="input" onClick={(e) => {((e.target as HTMLElement).querySelector(".text") as HTMLElement)?.focus()}}>
                        <p
                            className={"text"}
                            ref={textInputRef}
                            contentEditable={true}
                            onInput={updateTextValue}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                        />

                        {wuConstants.Regex.empty.test(textValue) && <p className="placeholder">{attribute.definition?.name || "Unnamed"}</p>}
                    </div>
                    {wuConstants.Regex.empty.test(textValue) && (
                        <div className="icon">
                            <Type size={18} strokeWidth={2} />
                        </div>
                    )}
                </>
            )
            break
    }

    return <div className="sceneAttribute">{content}</div>
}

export default SceneAttribute