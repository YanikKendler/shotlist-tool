package me.kendler.yanik.dto.scene;

import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

import java.util.Set;

public record SceneAttributeEditDTO(
    Long id,
    Set<Long> multiSelectValue,
    Long singleSelectValue,
    String textValue
){ }
