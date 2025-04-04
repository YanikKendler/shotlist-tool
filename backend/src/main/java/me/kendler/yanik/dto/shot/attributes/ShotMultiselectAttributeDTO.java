package me.kendler.yanik.dto.shot.attributes;

import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.Set;

public record ShotMultiselectAttributeDTO(
    Long id,
    ShotAttributeDefinitionBase definition,
    Set<ShotSelectAttributeOptionDefinition> multiselectValue
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
