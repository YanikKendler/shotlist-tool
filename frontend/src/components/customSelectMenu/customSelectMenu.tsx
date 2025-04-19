"use client"

import { components, GroupBase, MenuProps } from "react-select";
import { SelectOption } from "@/util/Types";
import { Pen } from "lucide-react";
import "./customSelectMenu.scss";

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
    );
};
