import Select, {
    ClearIndicatorProps,
    components,
    DropdownIndicatorProps,
    MultiValue,
    MultiValueProps
} from "react-select"
import {reactSelectTheme} from "@/util/Utils"
import React, {useState} from "react"
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

export default function MultiSelect({name, placeholder = "Select...", options, onChange, minWidth = '8rem', sorted = false}: {name: string, placeholder?: string, options: SelectOption[], onChange: (newValue: MultiValue<SelectOption>)=>void, minWidth?: string, sorted?: boolean}) {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<SelectOption>>([]);

    const handleChange = (selectedOptions: MultiValue<SelectOption>) => {
        let newOptions= selectedOptions.values().toArray()
        if(sorted)
            newOptions = selectedOptions.values().toArray().sort((a, b) =>
                a.value.localeCompare(b.value)
            )
        setSelectedOptions(newOptions);
        onChange(newOptions);
    };

    return (
        <Select
            isMulti
            name={name}
            value={selectedOptions}
            options={options}
            onChange={handleChange}
            theme={reactSelectTheme}
            closeMenuOnSelect={false}
            placeholder={placeholder}
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
                    borderRadius: '0.4rem',
                    minWidth: minWidth,
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                    borderWidth: '.15rem',
                    borderStyle: 'solid',
                    borderColor: state.isFocused ? 'var(--accent)' : 'var(--default-interactable-border)',
                    '&:hover': {
                        borderColor: state.isFocused ? 'var(--accent)' : 'var(--default-interactable-border-hover)',
                    },
                    outline: "none",
                    boxShadow: "none"
                }),
                menu: (base) => ({
                    ...base,
                    padding: '0.3rem',
                    borderRadius: '0.4rem',
                    border: '.1rem solid var(--default-interactable-border)',
                    marginBlock: '.1rem'
                }),
                menuList: (base) => ({
                    ...base,
                    padding: '0rem',
                }),
                option: (base, state) => ({
                    ...base,
                    borderRadius: '0.3rem',
                })
            }}
        />
    );
}