'use client'

import {AnyShotAttribute, SelectOption} from "@/util/Types"
import React, {ChangeEventHandler, useDebugValue, useState} from "react"
import gql from "graphql-tag"
import {useApolloClient} from "@apollo/client"
import './shotAttribute.scss'
import AsyncCreatableSelect from "react-select/async-creatable"
import {CustomSelectMenu} from "@/components/customSelectMenu/customSelectMenu"
import {selectStyles, selectTheme} from "@/util/selectConfig"
import {components, MultiValueProps, PlaceholderProps, ValueContainerProps} from "react-select"

export default function ShotAttribute({attribute}: {attribute: AnyShotAttribute}){
    const [singleSelectValue, setSingleSelectValue] = useState<SelectOption>();
    const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>();

    const client = useApolloClient()

    const loadOptions = async (inputValue: string) => {
        console.log("loading options from server")
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
            variables: { definitionId: attribute.definition?.id, searchTerm: inputValue },
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

        console.log(data.createShotSelectAttributeOption)

        setSingleSelectValue({
            label: data.createShotSelectAttributeOption.name,
            value: data.createShotSelectAttributeOption.id
        })
    }

    const updateTextValue = (e: any) => {
        console.log(e)
    }

    const updateSingleSelectValue = (e: any) => {
        console.log(e)
    }

    const updateMultiSelectValue = (e: any) => {
        console.log(e)
    }

    const { ValueContainer, Placeholder } = components;

    const CustomMultiValue = (
        props: MultiValueProps<SelectOption, true>
    ) => {
        // only render the chip when the dropdown is actually open
        if (!props.selectProps.menuIsOpen) return null;
        return <components.MultiValue {...props} />;
    };

    const CustomValueContainer = (
        props: ValueContainerProps<SelectOption, true>
    ) => {
        const { children, innerProps, selectProps, getValue } = props;
        const isOpen = selectProps.menuIsOpen;
        const selected = getValue();

        const filteredChildren = React.Children.toArray(children).filter(
            (child) =>
                !(
                    React.isValidElement<PlaceholderProps<SelectOption, true>>(child) &&
                    child.type === Placeholder
                )
        )

        return (
            <ValueContainer {...props}>
                {!isOpen && (
                    <div {...innerProps} style={{ width: "100%", cursor: "pointer" }}>
                        {selected.length > 0
                            ? selected.map((o) => o.label).join(", ")
                            : selectProps.placeholder}
                    </div>
                )}

                <div style={{ display: isOpen ? "block" : "none" }}>
                    {filteredChildren}
                </div>
            </ValueContainer>
        )
    }

    switch (attribute.__typename) {
        case "ShotSingleSelectAttributeDTO":
            return (
                <div className="shotAttribute">
                    <AsyncCreatableSelect
                        value={singleSelectValue}
                        onChange={(newValue) => updateSingleSelectValue(newValue)}
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
                        onChange={(newValue) => updateMultiSelectValue(newValue)}
                        isMulti
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
                    <input
                        type="text"
                        defaultValue={attribute.textValue || ""}
                        placeholder={attribute.definition?.name || ""}
                        onChange={updateTextValue}
                    />
                </div>
            )
    }
}