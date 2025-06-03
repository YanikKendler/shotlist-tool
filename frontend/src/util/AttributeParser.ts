import {
    AnySceneAttribute,
    AnySceneAttributeDefinition,
    AnyShotAttribute,
    AnyShotAttributeDefinition
} from "@/util/Types"
import {ChevronDown, List, Type} from "lucide-react"
import {JSX} from "react"
import {wuText} from "@yanikkendler/web-utils/dist"

export abstract class SceneAttributeParser {
    static toValueString(attribute: AnySceneAttribute, truncate = true): string{
        let result = ""
        switch (attribute.__typename) {
            case "SceneTextAttributeDTO":
                result = attribute?.textValue || ""
                break
            case "SceneSingleSelectAttributeDTO":
                result = <string>attribute.singleSelectValue?.name
                break
            case "SceneMultiSelectAttributeDTO":
                result = <string>attribute.multiSelectValue?.map((value) => value?.name).join(", ")
                break
        }
        return truncate ? wuText.truncateText(result, 15, "..") : result
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

export abstract class ShotAttributeParser {
    static toValueString(attribute: AnyShotAttribute, truncate = true): string{
        let result = ""
        switch (attribute.__typename) {
            case "ShotTextAttributeDTO":
                result = attribute.textValue || ""
                break
            case "ShotSingleSelectAttributeDTO":
                result = <string>attribute.singleSelectValue?.name
                break
            case "ShotMultiSelectAttributeDTO":
                result = <string>attribute.multiSelectValue?.map((value) => value?.name).join(", ")
                break
        }
        return truncate ? wuText.truncateText(result, 15, "..") : result
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