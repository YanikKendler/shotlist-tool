package me.kendler.yanik.model.template.sceneAttributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneTextAttributeDefinition;

@Entity
public class SceneTextAttributeTemplate extends SceneAttributeTemplateBase {
    @Override
    public String getType() {
        return "SceneText";
    }

    @Override
    public SceneAttributeDefinitionBase createDefinition(Shotlist shotlist) {
        return new SceneTextAttributeDefinition(shotlist, name);
    }
}