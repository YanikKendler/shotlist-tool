import {ChevronDown, File, ListOrdered, Plus} from "lucide-react"
import React, {useState} from "react"
import gql from "graphql-tag"
import {pdf} from "@react-pdf/renderer"
import PDFExport from "@/components/PDFExport"
import {wuTime} from "@yanikkendler/web-utils/dist"
import {useApolloClient} from "@apollo/client"
import {ShotlistDto} from "../../../../../lib/graphql/generated"
import "./exportTab.scss"
import { Select } from "radix-ui"
import SimpleSelect from "@/components/simpleSelect/simpleSelect"

export default function ExportTab({shotlist}: { shotlist: ShotlistDto}) {
    const [selectedFileType, setSelectedFileType] = useState<"PDF" | "CSV">("PDF")

    const client = useApolloClient()

    async function exportPDF() {
        const {data, error, loading} = await client.query({
                query: gql`
                    query shotlistForExport($id: String!) {
                        shotlist(id: $id){
                            id
                            name
                            scenes{
                                id
                                position
                                attributes{
                                    id
                                    definition{id, name, position}

                                    ... on SceneSingleSelectAttributeDTO{
                                        singleSelectValue{id,name}
                                    }

                                    ... on SceneMultiSelectAttributeDTO{
                                        multiSelectValue{id,name}
                                    }
                                    ... on SceneTextAttributeDTO{
                                        textValue
                                    }
                                }
                                shots {
                                    id
                                    position
                                    attributes{
                                        id
                                        definition{id, name, position}

                                        ... on ShotSingleSelectAttributeDTO{
                                            singleSelectValue{id,name}
                                        }

                                        ... on ShotMultiSelectAttributeDTO{
                                            multiSelectValue{id,name}
                                        }
                                        ... on ShotTextAttributeDTO{
                                            textValue
                                        }
                                    }
                                }
                            }
                            sceneAttributeDefinitions{
                                id
                                name
                            }
                            shotAttributeDefinitions{
                                id
                                name
                            }
                        }
                    }`,
                variables: {id: shotlist.id}
            }
        )

        const blob = await pdf(<PDFExport data={data.shotlist}/>).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `shotly-${shotlist.name}-${wuTime.toFullDateTimeString(Date.now())}.pdf`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className={"shotlistOptionsDialogExportTab"}>
            <h2>Configure the export</h2>
            <div className="filters">
                <div className="filter">
                    <div className="left">
                        <File/>
                        <p>Format</p>
                    </div>
                    <select defaultValue={selectedFileType}>
                        <option value="PDF">PDF</option>
                        <option value="CSV">CSV</option>
                    </select>

                    <SimpleSelect
                        name={"File Type"}
                        onChange={newValue => {console.log(newValue)}}
                        options={[{value: "PDF", label: "PDF"}, {value: "CSV", label: "CSV"}]}
                        value={"PDF"}
                    />
                </div>
                <div className="filter">
                    <div className="left">
                        <ListOrdered/>
                        <p>Scenes</p>
                    </div>
                </div>
                <button className="addFilter">add filter<Plus size={16}/></button>
            </div>
            <button className={"export"} onClick={exportPDF}>export shotlist</button>
        </div>
    )
}