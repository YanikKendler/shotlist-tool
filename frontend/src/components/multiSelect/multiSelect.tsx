import Select, {
    ClearIndicatorProps,
    components,
    DropdownIndicatorProps,
    MultiValue,
    MultiValueProps
} from "react-select"
import {reactSelectTheme} from "@/util/Utils"
import React from "react"
import {ChevronDown, X} from "lucide-react"
import {SelectOption} from "@/util/Types"

const CustomDropdownIndicator = (
    props: DropdownIndicatorProps<SelectOption, true>
) => {
    return <components.DropdownIndicator {...props} children={<ChevronDown size={20}/>}/>;
};

const CustomClearIndicator = (
    props: ClearIndicatorProps<SelectOption, true>
) => {
    return <components.ClearIndicator {...props} children={<X size={18}/>}/>;
}

export default function MultiSelect({name, options, onChange, minWidth = '8rem'}: {name: string, options: SelectOption[], onChange: (newValue: MultiValue<SelectOption>)=>void, minWidth?: string}) {
    return (
        <Select
            isMulti
            name={name}
            options={options}
            onChange={onChange}
            theme={reactSelectTheme}
            closeMenuOnSelect={false}
            components={{
                DropdownIndicator: CustomDropdownIndicator,
                ClearIndicator: CustomClearIndicator,
            }}
            styles={{
                clearIndicator: (base) => ({
                    ...base,
                    cursor: 'pointer',
                }),
                dropdownIndicator: (base) => ({
                    ...base,
                    cursor: 'pointer',
                    color: "var(--text-50)",
                }),
                control: (base, state) => ({
                    ...base,
                    border: '.1rem solid var(--default-interactable-border)',
                    borderRadius: '0.4rem',
                    minWidth: minWidth,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    '&:hover': {
                        borderColor: state.isFocused ? 'var(--accent)' : 'var(--default-interactable-border-hover)',
                    }
                })
            }}
        />
    );
}