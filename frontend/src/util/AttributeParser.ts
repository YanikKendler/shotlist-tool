import {AnySceneAttribute, AnySceneAttributeDefinition, AnyShotAttributeDefinition} from "@/util/Types"
import {ChevronDown, List, Type} from "lucide-react"
import {JSX} from "react"
import {wuText} from "@yanikkendler/web-utils/dist"

export abstract class SceneAttributeParser {
    static toValueString(attribute: AnySceneAttribute): string{
        switch (attribute.__typename) {
            case "SceneTextAttributeDTO":
                return wuText.truncateText(<string>attribute.textValue, 15, "..")
            case "SceneSingleSelectAttributeDTO":
                return <string>attribute.singleSelectValue?.name
            case "SceneMultiSelectAttributeDTO":
                return <string>attribute.multiSelectValue?.map((value) => value?.name).join(", ")
        }
        return ""
    }

    static isEmpty(attribute: AnySceneAttribute): boolean{
        switch (attribute.__typename) {
            case "SceneTextAttributeDTO":
                return attribute.textValue === ""
            case "SceneSingleSelectAttributeDTO":
                return attribute.singleSelectValue === null
            case "SceneMultiSelectAttributeDTO":
                return !attribute.multiSelectValue || attribute.multiSelectValue.length === 0
        }
        return true
    }
}

export abstract class ShotAttributeDefinitionParser {
    static toIcon(attribute: AnyShotAttributeDefinition){
        switch (attribute.__typename) {
            case "ShotTextAttributeDefinitionDTO":
                return Type
            case "ShotSingleSelectAttributeDefinitionDTO":
                return ChevronDown
            case "ShotMultiSelectAttributeDefinitionDTO":
                return List
            default:
                return Type
        }
    }
}

export abstract class SceneAttributeDefinitionParser {
    static toIcon(attribute: AnySceneAttributeDefinition){
        switch (attribute.__typename) {
            case "SceneTextAttributeDefinitionDTO":
                return Type
            case "SceneSingleSelectAttributeDefinitionDTO":
                return ChevronDown
            case "SceneMultiSelectAttributeDefinitionDTO":
                return List
            default:
                return Type
        }
    }
}