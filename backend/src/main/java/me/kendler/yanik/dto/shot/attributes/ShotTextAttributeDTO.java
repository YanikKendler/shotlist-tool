package me.kendler.yanik.dto.shot.attributes;

import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

public record ShotTextAttributeDTO(
    Long id,
    Shot shot,
    ShotAttributeDefinitionBase definition,
    String textValue
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
