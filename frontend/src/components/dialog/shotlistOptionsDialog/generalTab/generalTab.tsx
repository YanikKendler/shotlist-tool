import {ShotlistDto} from "../../../../../lib/graphql/generated"
import {Separator} from "radix-ui"
import React from "react"
import gql from "graphql-tag"
import {wuGeneral, wuTime} from "@yanikkendler/web-utils/dist"
import {useApolloClient} from "@apollo/client"
import {useConfirmDialog} from "@/components/dialog/confirmDialog/confirmDialoge"
import {useRouter} from "next/navigation"
import "./generalTab.scss"

export default function GeneralTab({shotlist, setShotlist}: { shotlist: ShotlistDto, setShotlist: (shotlist: ShotlistDto) => void }) {
    const client = useApolloClient()
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const router = useRouter()

    const updateShotlistName = async (name: string) => {
        const { data, errors } = await client.mutate({
            mutation: gql`
                mutation updateShotlistName($shotlistId: String!, $name: String!) {
                    updateShotlist(editDTO: {
                        id: $shotlistId
                        name: $name
                    }){
                        id
                        name
                    }
                }
            `,
            variables: { shotlistId: shotlist.id, name: name },
        });

        if (errors) {
            console.error(errors);
            return;
        }

        setShotlist({
            ...shotlist,
            name: data.updateShotlist.name
        })
    }

    const debounceUpdateShotlistName = wuGeneral.debounce(updateShotlistName)

    const deleteShotlist = async () => {
        let decision = await confirm({
            title: 'Are you absolutely sure?',
            message: `Do you want to delete the shotlist "${shotlist.name}" and its ${shotlist.sceneCount} scenes and ${shotlist.shotCount} shots? This action cannot be undone.`,
            buttons: {
                confirm: {
                    text: 'Delete shotlist',
                    className: 'bad'
                }
            },
            checkbox: true
        })

        if(!decision) return

        const { errors } = await client.mutate({
            mutation: gql`
                mutation deleteShotlist($id: String!) {
                    deleteShotlist(id: $id) {
                        id
                    }
                }
            `,
            variables: { id: shotlist.id },
        });

        if(errors) {
            console.error(errors)
        }
        else{
            router.push("/dashboard")
        }
    }

    return (
        <div className={"shotlistOptionsDialogGeneralTab"}>
            <h2>Shotlist settings</h2>
            <div className={"labeledInput"}>
                <label htmlFor={"name"}>Name</label>
                <input
                    type="text"
                    name={"name"}
                    defaultValue={shotlist.name || ""}
                    placeholder={"My shotlist"}
                    onInput={event => debounceUpdateShotlistName(event.currentTarget.value)}/>
            </div>

            <Separator.Root className={"Separator"}></Separator.Root>

            <div className="details">
                <p>created at {wuTime.toFullDateTimeString(shotlist.createdAt)} by {shotlist.owner?.name}</p>
                <p>last edited at: {wuTime.toFullDateTimeString(shotlist.editedAt)}</p>
                <p>{shotlist.sceneCount} scenes • {shotlist.shotCount} shots</p>
            </div>

            <Separator.Root className={"Separator dangerZone"}></Separator.Root>

            <div className="row">
                <p>Permanently delete the shotlist "{shotlist.name}"</p>
                <button className="deleteShotlist bad" onClick={deleteShotlist}>delete shotlist</button>
            </div>
            {ConfirmDialog}
        </div>
    )
}