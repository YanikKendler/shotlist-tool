'use client'

import {AnyShotAttribute, ShotAttributeValueCollection, SelectOption} from "@/util/Types"
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import './shotAttribute.scss'
import {useSelectRefresh} from "@/components/SelectRefreshContext"
import {wuConstants, wuGeneral} from "@yanikkendler/web-utils"
import Select, {selectShotStyles} from "@/components/select/select"
import ShotService from "@/service/ShotService"

const ShotAttribute = React.memo(function ShotAttribute({attribute}: {attribute: AnyShotAttribute}){
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption>();
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>();
    const [textValue, setTextValue] = useState<string>("");

    const textInputRef = useRef<HTMLParagraphElement | null>(null);

    const { refreshMap, triggerRefresh } = useSelectRefresh();

    const client = useApolloClient()

    useEffect(() => {
        if (!attribute) return;

        switch (attribute.__typename) {
            case "ShotSingleSelectAttributeDTO":
                if(attribute.singleSelectValue === null) return
                setSingleSelectValue({
                    label: attribute.singleSelectValue?.name || "",
                    value: attribute.singleSelectValue?.id || "",
                })
                break
            case "ShotMultiSelectAttributeDTO":
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
            case "ShotTextAttributeDTO":
                if(textValue == "") setTextValue(attribute.textValue || "")
                break
        }
    }, []);

    useEffect(() => {
        if (textInputRef.current && textInputRef.current.textContent !== textValue) {
            textInputRef.current.textContent = textValue;
        }
    }, [textValue]);

    const loadOptions = async (inputValue: string) => {
        //TODO optimize this, especially when dragging, some sort of cashing is needed
        const { data } = await client.query({
            query: gql`
                query searchShotSelectAttributeOptions($definitionId: BigInteger!, $searchTerm: String!) {
                    searchShotSelectAttributeOptions(
                        searchDTO: { shotAttributeDefinitionId: $definitionId, searchTerm: $searchTerm }
                    ) {
                        id
                        name
                    }
                }
            `,
            variables: { definitionId: attribute.definition?.id, searchTerm: inputValue},
            fetchPolicy: 'no-cache'
        });

        return data.searchShotSelectAttributeOptions.map((option: any): SelectOption => ({
            value: option.id,
            label: option.name,
        }));
    }

    const createOption = async (inputValue: string) => {
        const { data } = await client.mutate({
            mutation: gql`
                mutation createShotOption($definitionId: BigInteger!, $name: String!) {
                    createShotSelectAttributeOption(createDTO:{
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
            label: data.createShotSelectAttributeOption.name,
            value: data.createShotSelectAttributeOption.id
        })
        setMultiSelectValue([
            ...multiSelectValue || [],
            {
                label: data.createShotSelectAttributeOption.name,
                value: data.createShotSelectAttributeOption.id
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

        debouncedUpdateAttributeValue(attribute.id, {textValue: cleaned})
    }

    const updateSingleSelectValue = (value: SelectOption | null) => {
        setSingleSelectValue(value || undefined)
        ShotService.updateAttribute(attribute.id, {singleSelectValue: Number(value?.value)})
    }

    const updateMultiSelectValue = (value: SelectOption[] | null) => {
        setMultiSelectValue(value || [])
        ShotService.updateAttribute(attribute.id, {multiSelectValue: value?.map((option) => Number(option.value))})
    }

    const debouncedUpdateAttributeValue = useMemo(() => wuGeneral.debounce(ShotService.updateAttribute), []);

    switch (attribute.__typename) {
        case "ShotSingleSelectAttributeDTO":
            return (
                <div className="shotAttribute">
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={false}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateSingleSelectValue(newValue as SelectOption)}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || ""}
                        value={singleSelectValue}
                        shotOrScene={"shot"}
                        styles={selectShotStyles}
                    ></Select>
                </div>
            )
        case "ShotMultiSelectAttributeDTO":
            return (
                <div className="shotAttribute">
                    <Select
                        definitionId={attribute.definition?.id}
                        isMulti={true}
                        loadOptions={loadOptions}
                        onChange={(newValue) => updateMultiSelectValue(newValue as SelectOption[])}
                        onCreate={createOption}
                        placeholder={attribute.definition?.name || ""}
                        value={multiSelectValue}
                        shotOrScene={"shot"}
                        styles={selectShotStyles}
                    ></Select>
                </div>
            )
        case "ShotTextAttributeDTO":
            return (
                <div className="shotAttribute">
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
})

export default ShotAttribute;
