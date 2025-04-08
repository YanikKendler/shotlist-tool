package me.kendler.yanik.dto.scene;

import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

import java.util.Set;

public record SceneAttributeEditDTO(
    Long id,
    Set<SceneSelectAttributeOptionDefinition> multiSelectValue,
    SceneSelectAttributeOptionDefinition singleSelectValue,
    String textValue
){ }
