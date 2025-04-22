'use client'

import "./select.scss"
import {SelectOption} from "@/util/Types"
import AsyncCreatableSelect from "react-select/async-creatable"
import React, {useCallback, useEffect} from "react"
import {useSelectRefresh} from "@/components/SelectRefreshContext"
import {
    components,
    GroupBase,
    MenuProps,
    MultiValueProps,
    StylesConfig,
    ThemeConfig,
    ValueContainerProps
} from "react-select"
import {Pen} from "lucide-react"

export const selectTheme: ThemeConfig = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: 'var(--accent)',
        primary25: 'var(--accent-95)',
        primary50: 'var(--accent-80)',
        primary75: 'var(--accent-60',
    },
})

export const selectStyles: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderColor: state.isFocused ? 'var(--accent)' : 'transparent',
        backgroundColor: "var(--shot-background)",
        zIndex: state.isFocused ? 100 : 0,
        cursor: 'text',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--accent)' : 'transparent',
        },
        height: "inherit"
    }),
    option: (baseStyles) => ({
        ...baseStyles,
        cursor: 'pointer',
        borderRadius: ".3rem",
        paddingInline: ".5rem",
        fontSize: ".9rem"
    }),
    multiValueRemove: (baseStyles) => ({
        ...baseStyles,
        cursor: 'pointer',
    }),
    menu: (baseStyles) => ({
        ...baseStyles,
        marginTop: 0,
    }),
    singleValue: (baseStyles) => ({
        ...baseStyles,
        color: "var(--text)",
        fontWeight: "500",
    })
}

export const CustomSelectMenu = <
    Option,
    IsMulti extends boolean = false
>(
    props: MenuProps<Option, IsMulti, GroupBase<Option>>
) => {
    return (
        <components.Menu {...props}>
            <div className="customSelectMenu">
                <div className="content">
                    {props.children}
                </div>
                <div className="bottom">
                    <p>Edit Attributes</p>
                    <Pen size={18} strokeWidth={2} />
                </div>
            </div>
        </components.Menu>
    )
}

export default function Select(
    {definitionId, value, onChange, onCreate, loadOptions, placeholder, isMulti, shotOrScene}:
    {
        definitionId: number,
        value: SelectOption | SelectOption[] | undefined,
        onChange: (newValue: any) => void,
        onCreate: (newValue: any) => void,
        loadOptions: (inputValue: string) => Promise<SelectOption[]>,
        placeholder: string,
        isMulti: boolean
        shotOrScene: "shot" | "scene"
}) {
    const { refreshMap } = useSelectRefresh();

    useEffect(() => {
        console.log(value)
    }, [value]);

    const CustomMultiValue = (
        props: MultiValueProps<SelectOption, true>
    ) => {
        if (!props.selectProps.menuIsOpen) return <p style={{display: "inline"}}>{props.data.label}</p>;
        return <components.MultiValue {...props} />;
    };

    const CustomValueContainer = useCallback((
        props: ValueContainerProps<SelectOption, true>
    ) => {
        const { children, innerProps, selectProps, getValue } = props;
        const selected = getValue()

        let childrenArray = React.Children.toArray(children);
        let options = childrenArray.slice(0, -1); // all selected items
        let input = childrenArray.at(-1);

        if(!selectProps.menuIsOpen && selected.length > 0) {
            options = options.map((child, index) => {
                if (index > 0 && index < selected.length) {
                    return <div style={{display: "inline"}} key={index}><span>,</span> {child}</div>
                }
                return child
            })
        }

        return (
            <components.ValueContainer {...props}>
                {options}
                {input}
            </components.ValueContainer>
        )
    }, []);

    const getComponents = (isMulti: boolean) => {
        if(isMulti)
            return {
                Menu: CustomSelectMenu,
                MultiValue: CustomMultiValue,
                ValueContainer: CustomValueContainer,
            }
        else
            return {
                Menu: CustomSelectMenu,
            }
    }

    return (
        <AsyncCreatableSelect
            key={`${definitionId}-${refreshMap[`${shotOrScene}-${definitionId}`] || 0}`}
            value={value}
            onChange={onChange}
            isMulti={isMulti}
            isClearable={false}
            onCreateOption={onCreate}
            loadOptions={loadOptions}
            defaultOptions
            placeholder={placeholder || ""}
            openMenuOnFocus={false}
            className="select"
            components={getComponents(isMulti)}
            theme={selectTheme}
            styles={selectStyles}
        />
    );
}
