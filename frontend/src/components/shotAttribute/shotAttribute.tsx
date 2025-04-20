'use client'

import {AnyShotAttribute, AttributeValueCollection, SelectOption} from "@/util/Types"
import React, {ChangeEventHandler, FormEventHandler, useDebugValue, useEffect, useRef, useState} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import './shotAttribute.scss'
import AsyncCreatableSelect from "react-select/async-creatable"
import {CustomSelectMenu} from "@/components/customSelectMenu/customSelectMenu"
import {selectStyles, selectTheme} from "@/util/selectConfig"
import {components, MultiValueProps, PlaceholderProps, ValueContainerProps} from "react-select"
import {useSelectRefresh} from "@/components/SelectRefreshContext"
import {wuConstants, wuGeneral, wuText} from "@yanikkendler/web-utils"
import {buildRetryFunction} from "@apollo/client/link/retry/retryFunction"

export default function ShotAttribute({attribute}: {attribute: AnyShotAttribute}){
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption>();
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>();
    const [textValue, setTextValue] = useState<string>("");

    const textInputRef = useRef<HTMLParagraphElement>(null);

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
                    (option) => ({
                        label: option?.name || "",
                        value: option?.id || "",
                    })
                ))
                break
            case "ShotTextAttributeDTO":
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
                mutation create($definitionId: BigInteger!, $name: String!) {
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

        triggerRefresh(attribute.definition?.id);
    }

    const updateTextValue = () => {
        if(!textInputRef.current) return;

        // remove all newlines
        let cleaned = textInputRef.current.innerText.replace(/[\r\n]+/g, " ");

        textInputRef.current.innerText = cleaned;

        // Move cursor to the end (otherwise it might jump)
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(textInputRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);

        setTextValue(cleaned)

        console.log("update text value")

        debouncedUpdateTextAttributeValue()
    }

    const updateSingleSelectValue = (value: SelectOption | null) => {
        updateAttributeValue({singleSelectValue: Number(value?.value)})
    }

    const updateMultiSelectValue = (value: SelectOption[] | null) => {
        updateAttributeValue({multiSelectValue: value?.map((option) => Number(option.value))})
    }

    const updateAttributeValue = async (value: AttributeValueCollection) => {
        console.log("updating attribute value", attribute.id, value)
        const {data, errors} = await client.mutate({
            mutation : gql`
                mutation update($id: BigInteger!, $textValue: String, $singleSelectValue: BigInteger, $multiSelectValue: [BigInteger]) {
                    updateShotAttribute(editDTO:{
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

    //TODO
    const debouncedUpdateTextAttributeValue = wuGeneral.debounce(() => updateAttributeValue({textValue: textValue}), 1000);

    const { ValueContainer, Placeholder } = components;

    const CustomMultiValue = (
        props: MultiValueProps<SelectOption, true>
    ) => {
        if (!props.selectProps.menuIsOpen) return null;
        return <components.MultiValue {...props} />;
    };

    const CustomValueContainer = (
        props: ValueContainerProps<SelectOption, true>
    ) => {
        const { children, innerProps, selectProps, getValue } = props;
        const isOpen = selectProps.menuIsOpen;
        const selected = getValue();

        return (
            <ValueContainer {...props}>
                <div style={{position: "absolute", width: "100%"}}>
                    {!isOpen && selected.length > 0 && (
                        <p style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                            {selected.map((o) => o.label).join(", ")}
                        </p>
                    )}
                </div>
                {children}
            </ValueContainer>
        )
    }

    switch (attribute.__typename) {
        case "ShotSingleSelectAttributeDTO":
            return (
                <div className="shotAttribute">
                    <AsyncCreatableSelect
                        key={`${attribute.definition?.id}-${refreshMap[attribute.definition?.id] || 0}`}
                        value={singleSelectValue}
                        onChange={(newValue) => updateSingleSelectValue(newValue as SelectOption)}
                        onCreateOption={createOption}
                        loadOptions={loadOptions}
                        defaultOptions
                        placeholder={attribute.definition?.name || ""}
                        openMenuOnFocus={false}
                        className="select"
                        components={{ Menu: CustomSelectMenu}}
                        theme={selectTheme}
                        styles={selectStyles}
                    />
                </div>
            )
        case "ShotMultiSelectAttributeDTO":
            return (
                <div className="shotAttribute">
                    <AsyncCreatableSelect
                        value={multiSelectValue}
                        onChange={(newValue) => updateMultiSelectValue(newValue as SelectOption[])}
                        isMulti
                        isClearable={false}
                        onCreateOption={createOption}
                        loadOptions={loadOptions}
                        defaultOptions
                        placeholder={attribute.definition?.name || ""}
                        openMenuOnFocus={false}
                        className="select"
                        components={{
                            Menu: CustomSelectMenu,
                            MultiValue: CustomMultiValue,
                            ValueContainer: CustomValueContainer,
                        }}
                        theme={selectTheme}
                        styles={selectStyles}
                    />
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
}