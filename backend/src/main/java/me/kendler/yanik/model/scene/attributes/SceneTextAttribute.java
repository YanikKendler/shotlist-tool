package me.kendler.yanik.model.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeEditDTO;
import me.kendler.yanik.dto.scene.attributes.SceneMultiselectAttributeDTO;
import me.kendler.yanik.dto.scene.attributes.SceneTextAttributeDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneTextAttributeDefinition;

@Entity
public class SceneTextAttribute extends SceneAttributeBase{
    public String value = "";

    public SceneTextAttribute() { super(); }

    public SceneTextAttribute(SceneTextAttributeDefinition definition, Scene scene) {
        super(scene, definition);
    }

    @Override
    public SceneAttributeBaseDTO toDTO() {
        return new SceneTextAttributeDTO(
            id,
            definition,
            value
        );
    }

    @Override
    public void update(SceneAttributeEditDTO editDTO) {
        value = editDTO.textValue();
    }
}