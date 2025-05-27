import {SceneAttributeType, ShotAttributeType, ShotlistDto} from "../../../../../lib/graphql/generated"
import {Popover, Separator, Tabs} from "radix-ui"
import React from "react"
import gql from "graphql-tag"
import {wuGeneral} from "@yanikkendler/web-utils/dist"
import {useApolloClient} from "@apollo/client"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import {useRouter} from "next/navigation"
import "./generalTab.scss"
import Image from "next/image"
import {closestCenter, DndContext} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import ShotAttributeDefinition from "@/components/shotAttributeDefinition/shotAttributeDefinition"
import {ChevronDown, List, Plus, Type} from "lucide-react"
import SceneAttributeDefinition from "@/components/sceneAttributeDefinition/sceneAttributeDefinition"
import {ShotlistOptionsDialogSubPage} from "@/components/dialog/shotlistOptionsDialog/shotlistOptionsDialoge"

export default function AttributeTab({shotlist, setShotlist}: { shotlist: ShotlistDto, setShotlist: (shotlist: ShotlistDto) => void }) {
    const client = useApolloClient()
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const router = useRouter()

    return (
        <div className={"shotlistOptionsDialogAttributeTab"}>

            {ConfirmDialog}
        </div>
    )
}