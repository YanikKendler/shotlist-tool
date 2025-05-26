import {Download, File, ListOrdered, Plus} from "lucide-react"
import React, {useEffect, useState} from "react"
import gql from "graphql-tag"
import {pdf} from "@react-pdf/renderer"
import PDFExport from "@/components/PDFExport"
import {wuTime} from "@yanikkendler/web-utils/dist"
import {useApolloClient} from "@apollo/client"
import {SceneDto, ShotlistDto} from "../../../../../lib/graphql/generated"
import "./exportTab.scss"
import SimpleSelect from "@/components/simpleSelect/simpleSelect"
import {SelectOption} from "@/util/Types"
import Select from 'react-select';
import {reactSelectTheme} from "@/util/Utils"
import MultiSelect from "@/components/multiSelect/multiSelect"

export default function ExportTab({shotlist}: { shotlist: ShotlistDto}) {
    const [selectedFileType, setSelectedFileType] = useState<"PDF" | "CSV">("PDF")
    const [sceneOptions, setSceneOptions] = useState<SelectOption[]>([{value: "this is bad", label: "1"}]);
    const [selectedScenes, setSelectedScenes] = useState<number[]>([]);

    const client = useApolloClient()

    useEffect(() => {
        let newSceneOptions: SelectOption[] = [];
        for (let i = 0; i < shotlist.sceneCount; i++) {
            newSceneOptions.push({value: i.toString(), label: `${(i + 1).toString()}`});
        }
        console.log(newSceneOptions, shotlist)
        setSceneOptions(newSceneOptions)
    }, [shotlist]);

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

        console.log(data.shotlist, selectedScenes)

        let filteredScenes = (data.shotlist.scenes as SceneDto[]).filter((scene) => selectedScenes.includes(scene.position))
        let filteredData = {...data.shotlist, scenes: filteredScenes}

        console.log(filteredScenes)

        const blob = await pdf(<PDFExport data={filteredData}/>).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `shotly-${shotlist.name}-${wuTime.toFullDateTimeString(Date.now())}.pdf`
        link.click()
        URL.revokeObjectURL(url)
    }

    if(!shotlist) return <p>loading</p>

    return (
        <div className={"shotlistOptionsDialogExportTab"}>
            <h2>Configure the export</h2>
            <div className="filters">
                <div className="filter">
                    <div className="left">
                        <File/>
                        <p>Format</p>
                    </div>

                    <SimpleSelect
                        name="File Type"
                        onChange={newValue => setSelectedFileType(newValue as "PDF" | "CSV")}
                        options={[{value: "PDF", label: "PDF"}, {value: "CSV", label: "CSV"}]}
                        value={"PDF"}
                        fontSize={".95rem"}
                    />
                </div>
                <div className="filter">
                    <div className="left">
                        <ListOrdered/>
                        <p>Scenes</p>
                    </div>

                    <MultiSelect
                        name={"Scenes"}
                        options={sceneOptions}
                        onChange={newValue => {
                            setSelectedScenes(newValue.map((option: SelectOption) => parseInt(option.value)))
                        }}
                        minWidth={"20rem"}
                    />
                </div>
                <button className="addFilter">add filter<Plus size={16}/></button>
            </div>
            <button className={"export"} onClick={exportPDF}>export shotlist<Download size={16} strokeWidth={3}/></button>
        </div>
    )
}