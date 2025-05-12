"use client";

import {createContext} from "react"

export const ShotlistContext = createContext<{
    openShotlistOptionsDialog: () => void
    elementIsBeingDragged: boolean
    setElementIsBeingDragged: (isBeingDragged: boolean) => void
}>({
    openShotlistOptionsDialog: () => {}, //open the edit dialog from anywhere: like the shot attribute value selector
    elementIsBeingDragged: false, //used to disable tooltips when dragging
    setElementIsBeingDragged: (isBeingDragged: boolean) => {}
});