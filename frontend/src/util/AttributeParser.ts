import {
    SceneMultiSelectAttributeDto,
    SceneSingleSelectAttributeDto,
    SceneTextAttributeDto
} from "../../lib/graphql/generated"

export abstract class SceneAttributeParser {
    static toValueString(attribute: SceneTextAttributeDto | SceneSingleSelectAttributeDto | SceneMultiSelectAttributeDto): string{
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