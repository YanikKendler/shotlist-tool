import * as React from "react";
import { Select } from "radix-ui";
import "./simpleSelect.scss";
import {ChevronDown, ChevronUp} from "lucide-react";
import {SelectOption} from "@/util/Types"

export default function SimpleSelect ({name, value, onChange, options}:{name: string, value: string, onChange: (newValue: string) => void, options: SelectOption[] }) {
    return (
        <Select.Root onValueChange={onChange} defaultValue={value} /*open={true}*/>
            <Select.Trigger className="SelectTrigger" aria-label="select">
                <Select.Value placeholder={`Select a ${name}…`}/>
                <Select.Icon className="SelectIcon">
                    <ChevronDown/>
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="SelectContent" position={"popper"}>
                    {options?.map((option) => (
                        <Select.Item
                            value={option.value}
                            key={option.value}
                            className="SelectItem"
                        >
                            <Select.ItemText>{option.label}</Select.ItemText>
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}

