import {Tooltip} from "radix-ui"
import {Info} from "lucide-react"
import React, {useEffect, useRef, useState} from "react"
import "./input.scss"

export default function Input(
    {
        label,
        value = "",
        valueChange = () => {},
        placeholder = "",
        info,
        disabled = false,
        maxLength = 255,
        maxWidth = "40ch"
    }
    :
    {
        label?: string;
        value?: string;
        valueChange?: (value: string) => void;
        placeholder?: string;
        info?: string;
        disabled?: boolean;
        maxLength?: number;
        maxWidth?: string;
    }
) {
    const [currentValue, setCurrentValue] = useState<string>(value || "");
    const [error, setError] = useState<string>("");
    const [errorType, setErrorType] = useState<"warning" | "max">("warning");

    useEffect(() => {
        validateInput(value)
        setCurrentValue(value)
    }, [value]);

    function validateInput(value: string) {
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
        valueChange(value)
    }

    return (
        <div className="customInput">
            {
                label &&
                <label htmlFor="{label}">{label}</label>
            }
            <div className="infoContainer">
                <div className="errorContainer" style={{maxWidth: maxWidth}}>
                    <input
                        id="{label}"
                        type="text"
                        placeholder={placeholder}
                        value={currentValue}
                        onInput={e => handleInput(e.currentTarget.value)}
                        maxLength={maxLength}
                        disabled={disabled}
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