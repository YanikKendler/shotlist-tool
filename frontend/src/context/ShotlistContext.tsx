"use client";

import {createContext} from "react"
import {
    ShotlistOptionsDialogPage,
    ShotlistOptionsDialogSubPage
} from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"

export const ShotlistContext = createContext<{
    openShotlistOptionsDialog: (page: { main: ShotlistOptionsDialogPage, sub?: ShotlistOptionsDialogSubPage }) => void
    elementIsBeingDragged: boolean
    setElementIsBeingDragged: (isBeingDragged: boolean) => void
}>({
    openShotlistOptionsDialog: (page) => {}, //open the edit dialog from anywhere: like the shot attribute value selector
    elementIsBeingDragged: false, //used to disable tooltips when dragging
    setElementIsBeingDragged: (isBeingDragged: boolean) => {}
});