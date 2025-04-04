package me.kendler.yanik.dto.scene.attributes;

import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

import java.util.List;
import java.util.Set;

public record SceneMultiselectAttributeDTO(
        Long id,
        SceneAttributeDefinitionBase definition,
        Set<SceneSelectAttributeOptionDefinition> multiselectValue
) implements SceneAttributeBaseDTO{
    @Override
    public Long getId() {
        return id;
    }

    @Override
    public SceneAttributeDefinitionBase getDefinition() {
        return definition;
    }
}
