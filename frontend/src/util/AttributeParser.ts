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
}

export abstract class ShotAttributeDefinitionParser {

}