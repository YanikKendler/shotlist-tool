import {Checkbox} from "radix-ui"
import {Check} from "lucide-react"
import {useEffect, useState} from "react"
import "./labeledCheckbox.scss"

export default function LabeledCheckbox({text, checked, onCheckedChange}:{text: string, checked: boolean, onCheckedChange: (checked: boolean) => void}) {
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsChecked(checked)
    }, [checked]);

    return (
        <div className={"labeledCheckbox"}>
            <Checkbox.Root
                className="CheckboxRoot"
                checked={isChecked}
                onCheckedChange={(checked) => {
                    setIsChecked(checked === true)
                    onCheckedChange(checked === true)
                }}
            >
                <Checkbox.Indicator className="CheckboxIndicator">
                    <Check size={20} strokeWidth={3}/>
                </Checkbox.Indicator>
            </Checkbox.Root>
            <label>I know what i am doing</label>
        </div>
    );
}