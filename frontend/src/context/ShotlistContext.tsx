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
    shotCount: number
    setShotCount: (count: number) => void
    sceneCount: number
    setSceneCount: (count: number) => void
}>({
    openShotlistOptionsDialog: (page) => {}, //open the edit dialog from anywhere: like the shot attribute value selector
    elementIsBeingDragged: false, //to disable tooltips when dragging
    setElementIsBeingDragged: (isBeingDragged: boolean) => {},
    //for disabling move up/down buttons
    shotCount: 0,
    setShotCount: (count: number) => {},
    sceneCount: 0,
    setSceneCount: (count: number) => {}
});