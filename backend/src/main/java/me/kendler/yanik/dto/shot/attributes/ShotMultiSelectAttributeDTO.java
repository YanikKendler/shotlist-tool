package me.kendler.yanik.dto.shot.attributes;

import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.Set;

public record ShotMultiSelectAttributeDTO(
    Long id,
    ShotAttributeDefinitionBase definition,
    Set<ShotSelectAttributeOptionDefinition> multiSelectValue
) implements ShotAttributeBaseDTO {
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public ShotAttributeDefinitionBase getDefinition() {
        return definition;
    }
}
