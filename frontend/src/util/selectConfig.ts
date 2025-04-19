import {GroupBase, StylesConfig, ThemeConfig} from "react-select"
import {SelectOption} from "@/util/Types"

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
        backgroundColor: "transparent",
        cursor: 'text',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        '&:hover': {
            borderColor: state.isFocused ? 'var(--accent)' : 'transparent',
        },
    }),
    option: (baseStyles, { isFocused, isSelected }) => ({
        ...baseStyles,
        cursor: 'pointer',
        borderRadius: ".3rem",
        paddingInline: ".5rem"
    }),
}