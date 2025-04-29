"use client";

import {createContext} from "react"

export const ShotlistContext = createContext<{
    openShotlistOptionsDialog: () => void
}>({
    openShotlistOptionsDialog: () => {},
});