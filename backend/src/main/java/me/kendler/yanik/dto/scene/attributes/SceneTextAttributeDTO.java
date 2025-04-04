package me.kendler.yanik.dto.scene.attributes;

import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;

public record SceneTextAttributeDTO(
        Long id,
        SceneAttributeDefinitionBase definition,
        String textValue
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
