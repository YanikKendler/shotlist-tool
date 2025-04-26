import {AnySceneAttribute} from "@/util/Types"

export abstract class SceneAttributeParser {
    static toValueString(attribute: AnySceneAttribute): string{
        switch (attribute.__typename) {
            case "SceneTextAttributeDTO":
                return <string>attribute.textValue
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

}