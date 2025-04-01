package me.kendler.yanik.dto.shot.attributes;

import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.Set;

public record ShotSingleselectAttributeDTO(
    Long id,
    Shot shot,
    ShotAttributeDefinitionBase definition,
    ShotSelectAttributeOptionDefinition singleselectValue
) implements ShotAttributeBaseDTO {
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public Scene getShot() {
        return null;
    }

    @Override
    public ShotAttributeDefinitionBase getDefinition() {
        return definition;
    }
}
