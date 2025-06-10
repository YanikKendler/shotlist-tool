import {
    SceneAttributeDefinitionBase, SceneMultiSelectAttributeDefinitionDto,
    SceneMultiSelectAttributeDto, SceneSingleSelectAttributeDefinitionDto,
    SceneSingleSelectAttributeDto, SceneTextAttributeDefinitionDto,
    SceneTextAttributeDto,
    ShotAttributeDefinitionBase, ShotlistDto, ShotMultiSelectAttributeDefinitionDto,
    ShotMultiSelectAttributeDto, ShotSingleSelectAttributeDefinitionDto,
    ShotSingleSelectAttributeDto, ShotTextAttributeDefinitionDto,
    ShotTextAttributeDto, TemplateDto
} from "../../lib/graphql/generated"

export type AnySceneAttribute = SceneTextAttributeDto | SceneSingleSelectAttributeDto | SceneMultiSelectAttributeDto
export type AnyShotAttribute = ShotTextAttributeDto | ShotSingleSelectAttributeDto | ShotMultiSelectAttributeDto

export type AnyShotAttributeDefinition = ShotTextAttributeDefinitionDto | ShotSingleSelectAttributeDefinitionDto | ShotMultiSelectAttributeDefinitionDto
export type AnySceneAttributeDefinition = SceneTextAttributeDefinitionDto | SceneMultiSelectAttributeDefinitionDto | SceneSingleSelectAttributeDefinitionDto

export type ShotSingleOrMultiSelectAttributeDefinition = ShotSingleSelectAttributeDefinitionDto | ShotMultiSelectAttributeDefinitionDto
export type SceneSingleOrMultiSelectAttributeDefinition = SceneSingleSelectAttributeDefinitionDto | SceneMultiSelectAttributeDefinitionDto

export type AnyAttributeDefinition = AnyShotAttributeDefinition | AnySceneAttributeDefinition

export type ShotlistOrTemplate = ShotlistDto | TemplateDto

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
