package me.kendler.yanik.dto.shot.attributes;

import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.Set;

public record ShotAttributeEditDTO (
    Long id,
    Set<ShotSelectAttributeOptionDefinition> multiSelectValue,
    ShotSelectAttributeOptionDefinition singleSelectValue,
    String textValue
){ }
