import {Tooltip} from "radix-ui"
import {Info} from "lucide-react"
import React, {useCallback, useEffect, useRef, useState} from "react"
import "./input.scss"
import {wuGeneral} from "@yanikkendler/web-utils/dist"

export default function Input(
    {
        label,
        value,
        defaultValue = "",
        valueChange = () => {},
        placeholder = "",
        info,
        disabled = false,
        maxLength = 255,
        maxWidth = "40ch",
        inputClass = "",
        showError = true,
        debounceValueChange = false
    }
    :
    {
        label?: string;
        value?: string;
        defaultValue?: string;
        valueChange?: (value: string) => void;
        placeholder?: string;
        info?: string;
        disabled?: boolean;
        maxLength?: number;
        maxWidth?: string;
        inputClass?: string;
        showError?: boolean;
        debounceValueChange?: boolean;
    }
) {
    const [currentValue, setCurrentValue] = useState<string>(value || defaultValue);
    const [error, setError] = useState<string>("");
    const [errorType, setErrorType] = useState<"warning" | "max">("warning");

    useEffect(() => {
        if (!value) return
        validateInput(value)
        setCurrentValue(value)
    }, [value]);

    useEffect(() => {
        if(currentValue != "") return
        validateInput(defaultValue)
        setCurrentValue(defaultValue)
    }, [defaultValue])

    const debouncedValueChange = useCallback(
        wuGeneral.debounce(valueChange),
        [valueChange]
    )

    function validateInput(value: string) {
        setError("")

        if(!showError) return

        if(value.length > maxLength - 10) {
            setError(`${value.length}/${maxLength} characters`);
        }

        if(value.length >= maxLength) {
            setError(`${value.length}/${maxLength} characters reached`)
            setErrorType("max")
            return;
        }
        else {
            setErrorType("warning");
        }
    }

    function handleInput(value: string){
        validateInput(value)
        setCurrentValue(value)

        if(debounceValueChange && debouncedValueChange)
            debouncedValueChange(value)
        else
            valueChange(value)
    }

    return (
        <div className="customInput">
            {
                label &&
                <label htmlFor={label}>{label}</label>
            }
            <div className="infoContainer">
                <div className="errorContainer" style={{maxWidth: maxWidth}}>
                    <input
                        id={label}
                        type="text"
                        placeholder={placeholder}
                        value={currentValue}
                        onInput={e => handleInput(e.currentTarget.value)}
                        maxLength={maxLength}
                        disabled={disabled}
                        className={inputClass}
                        style={{maxWidth: maxWidth}}
                    />
                    <p className={"error " + errorType}>{error}</p>
                </div>
                {
                    info &&
                    <Tooltip.Root delayDuration={100}>
                        <Tooltip.Trigger className={"noPadding"}>
                            <Info/>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className={"TooltipContent"}>
                                <Tooltip.Arrow/>
                                <p>{info}</p>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                }
            </div>
        </div>
    );
}