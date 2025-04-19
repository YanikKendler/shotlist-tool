import {
    SceneMultiSelectAttributeDto,
    SceneSingleSelectAttributeDto,
    SceneTextAttributeDto, ShotMultiSelectAttributeDto, ShotSingleSelectAttributeDto, ShotTextAttributeDto
} from "../../lib/graphql/generated"

export type AnySceneAttribute = SceneTextAttributeDto | SceneSingleSelectAttributeDto | SceneMultiSelectAttributeDto
export type AnyShotAttribute = ShotTextAttributeDto | ShotSingleSelectAttributeDto | ShotMultiSelectAttributeDto

export interface SelectOption {
    label: string
    value: string
}