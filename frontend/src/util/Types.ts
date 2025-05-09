import {
    SceneAttributeDefinitionBase, SceneMultiSelectAttributeDefinitionDto,
    SceneMultiSelectAttributeDto, SceneSingleSelectAttributeDefinitionDto,
    SceneSingleSelectAttributeDto, SceneTextAttributeDefinitionDto,
    SceneTextAttributeDto,
    ShotAttributeDefinitionBase, ShotMultiSelectAttributeDefinitionDto,
    ShotMultiSelectAttributeDto, ShotSingleSelectAttributeDefinitionDto,
    ShotSingleSelectAttributeDto, ShotTextAttributeDefinitionDto,
    ShotTextAttributeDto
} from "../../lib/graphql/generated"

export type AnySceneAttribute = SceneTextAttributeDto | SceneSingleSelectAttributeDto | SceneMultiSelectAttributeDto
export type AnyShotAttribute = ShotTextAttributeDto | ShotSingleSelectAttributeDto | ShotMultiSelectAttributeDto

export type AnyShotAttributeDefinition = ShotTextAttributeDefinitionDto | ShotSingleSelectAttributeDefinitionDto | ShotMultiSelectAttributeDefinitionDto
export type AnySceneAttributeDefinition = SceneTextAttributeDefinitionDto | SceneMultiSelectAttributeDefinitionDto | SceneSingleSelectAttributeDefinitionDto

export type ShotSingleOrMultiSelectAttributeDefinition = ShotSingleSelectAttributeDefinitionDto | ShotMultiSelectAttributeDefinitionDto
export type SceneSingleOrMultiSelectAttributeDefinition = SceneSingleSelectAttributeDefinitionDto | SceneMultiSelectAttributeDefinitionDto

export type AnyAttributeDefinition = AnyShotAttributeDefinition | AnySceneAttributeDefinition

export interface SelectOption {
    label: string
    value: string
}

export interface ShotAttributeValueCollection {
    textValue?: string
    singleSelectValue?: number
    multiSelectValue?: number[]
}

export interface SceneAttributeValueCollection {
    textValue?: string
    singleSelectValue?: number
    multiSelectValue?: number[]
}
