"use client";

import {createContext} from "react"
import {
    ShotlistOptionsDialogPage,
    ShotlistOptionsDialogSubPage
} from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"
import {NotificationSettings} from "@/components/notification/notification"

export const NotificationContext = createContext<{
    notify: (settings: NotificationSettings) => void;
}>({
    notify: () => {},
});