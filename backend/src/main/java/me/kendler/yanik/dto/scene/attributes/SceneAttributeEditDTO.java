package me.kendler.yanik.dto.scene.attributes;

import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.Set;

public record SceneAttributeEditDTO(
    Long id,
    Set<SceneSelectAttributeOptionDefinition> multiSelectValue,
    SceneSelectAttributeOptionDefinition singleSelectValue,
    String textValue
){ }
