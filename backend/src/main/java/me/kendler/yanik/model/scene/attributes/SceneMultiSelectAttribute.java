package me.kendler.yanik.model.scene.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.scene.SceneAttributeEditDTO;
import me.kendler.yanik.dto.scene.attributes.SceneMultiselectAttributeDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@Entity
public class SceneMultiSelectAttribute extends SceneAttributeBase{
    @OneToMany(fetch = FetchType.EAGER)
    public Set<SceneSelectAttributeOptionDefinition> value = new HashSet<>();

    public SceneMultiSelectAttribute() { super(); }

    public SceneMultiSelectAttribute(SceneMultiSelectAttributeDefinition definition, Scene scene) {
        super(scene, definition);
    }

    @Override
    public SceneAttributeBaseDTO toDTO() {
        return new SceneMultiselectAttributeDTO(
            id,
            definition,
            value
        );
    }

    @Override
    public void update(SceneAttributeEditDTO editDTO) {
        value = editDTO.multiSelectValue();
    }
}