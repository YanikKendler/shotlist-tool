'use client'

import {
    AnySceneAttribute,
    AnyShotAttribute,
    ShotAttributeValueCollection,
    SelectOption,
    SceneAttributeValueCollection
} from "@/util/Types"
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import './sceneAttribute.scss'
import {useSelectRefresh} from "@/components/SelectRefreshContext"
import {wuConstants, wuGeneral} from "@yanikkendler/web-utils"
import Select, {selectSceneStyles} from "@/components/select/select"

export default function SceneAttribute({attribute}: {attribute: AnySceneAttribute}){
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption>();
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>();
    const [textValue, setTextValue] = useState<string>("");

    const textInputRef = useRef<HTMLParagraphElement>(null);

    const { refreshMap, triggerRefresh } = useSelectRefresh();

    const client = useApolloClient()

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
                setTextValue(attribute.textValue || "")
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
                query search($definitionId: BigInteger!, $searchTerm: String!) {
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
                mutation create($definitionId: BigInteger!, $name: String!) {
                    createSceneSelectAttributeOption(createDTO:{
                        selectAttributeId: $definitionId,
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { definitionId: attribute.definition?.id, name: inputValue },
        });

        setSingleSelectValue({
            label: data.createSceneSelectAttributeOption.name,
            value: data.createSceneSelectAttributeOption.id
        })
        setMultiSelectValue([
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
    }

    const updateSingleSelectValue = (value: SelectOption | null) => {
        setSingleSelectValue(value || undefined)
        updateAttributeValue({singleSelectValue: Number(value?.value)})
    }

    const updateMultiSelectValue = (value: SelectOption[] | null) => {
        setMultiSelectValue(value || [])
        updateAttributeValue({multiSelectValue: value?.map((option) => Number(option.value))})
    }

    const updateAttributeValue = async (value: SceneAttributeValueCollection) => {
        const {data, errors} = await client.mutate({
            mutation : gql`
                mutation update($id: BigInteger!, $textValue: String, $singleSelectValue: BigInteger, $multiSelectValue: [BigInteger]) {
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

    switch (attribute.__typename) {
        case "SceneSingleSelectAttributeDTO":
            return (
                <div className="sceneAttribute">
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={false}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateSingleSelectValue(newValue as SelectOption)}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || ""}
                        value={singleSelectValue}
                        shotOrScene={"scene"}
                        styles={selectSceneStyles}
                    ></Select>
                </div>
            )
        case "SceneMultiSelectAttributeDTO":
            return (
                <div className="sceneAttribute">
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={true}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateMultiSelectValue(newValue as SelectOption[])}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || ""}
                        value={multiSelectValue}
                        shotOrScene={"scene"}
                        styles={selectSceneStyles}
                    ></Select>
                </div>
            )
        case "SceneTextAttributeDTO":
            return (
                <div className="sceneAttribute">
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

                        {wuConstants.Regex.empty.test(textValue) && <p className="placeholder">{attribute.definition?.name || ""}</p>}
                    </div>
                </div>
            )
    }
}