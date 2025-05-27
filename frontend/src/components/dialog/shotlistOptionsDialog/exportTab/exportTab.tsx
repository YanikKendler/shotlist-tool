import {Download, File, ListOrdered, Plus} from "lucide-react"
import React, {useEffect, useRef, useState} from "react"
import gql from "graphql-tag"
import {pdf} from "@react-pdf/renderer"
import PDFExport from "@/components/PDFExport"
import {wuTime} from "@yanikkendler/web-utils/dist"
import {useApolloClient} from "@apollo/client"
import {SceneDto, ShotDto, ShotlistDto} from "../../../../../lib/graphql/generated"
import "./exportTab.scss"
import SimpleSelect from "@/components/simpleSelect/simpleSelect"
import {AnyShotAttribute, AnyShotAttributeDefinition, SelectOption} from "@/util/Types"
import Utils from "@/util/Utils"
import MultiSelect from "@/components/multiSelect/multiSelect"
import {ShotAttributeParser} from "@/util/AttributeParser"
//@ts-ignore
import { downloadCSV } from "download-csv";

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

    async function getData() {
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

        let filteredScenes= data.shotlist.scenes as SceneDto[]
        if(selectedScenes.length > 0)
            filteredScenes = (data.shotlist.scenes as SceneDto[]).filter((scene) => selectedScenes.includes(scene.position))

        return {...data.shotlist, scenes: filteredScenes} as ShotlistDto;
    }

    async function exportShotlist() {
        const data = await getData()

        switch (selectedFileType) {
            case "CSV":
                let csvData: string[][] = [];

                (data.scenes as SceneDto[]).forEach((scene) => {
                    (scene.shots as ShotDto[]).forEach(shot => {
                        let row: string[] = [scene.position+1 + Utils.numberToShotLetter(shot.position)];
                        (shot.attributes as AnyShotAttribute[]).forEach(attribute => {
                            row.push(ShotAttributeParser.toValueString(attribute, false))
                        })
                        csvData.push(row)
                    })
                })

                let headerArray = (data.shotAttributeDefinitions as AnyShotAttributeDefinition[]).map(attr => attr.name)

                let headerString = ["Shot", ...headerArray].join(",");

                downloadCSV(csvData, [headerString], generateFileName())

                break
            case "PDF":
                const blob = await pdf(<PDFExport data={data}/>).toBlob()
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = generateFileName() + ".pdf"
                link.click()
                URL.revokeObjectURL(url)
                break
        }

    }

    function generateFileName() {
        return `shotly-${shotlist.name}-${wuTime.toFullDateTimeString(Date.now())}`
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
                        sorted={true}
                        minWidth={"20rem"}
                    />
                </div>
                {/*TODO custom filters*/}
                {/*<button className="addFilter">add filter<Plus size={16}/></button>*/}
            </div>
            <button className={"export"} onClick={exportShotlist}>download shotlist<Download size={16} strokeWidth={3}/></button>
        </div>
    )
}