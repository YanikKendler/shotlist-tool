package me.kendler.yanik.model.template.sceneAttributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@Entity
public class SceneMultiSelectAttributeTemplate extends SceneAttributeTemplateBase {
    @OneToMany(fetch = FetchType.EAGER)
    public Set<SceneSelectAttributeOptionTemplate> options = new HashSet<>();

    @Override
    public String getType() {
        return "SceneMultiSelect";
    }

    @Override
    public SceneAttributeDefinitionBase createDefinition(Shotlist shotlist) {
        SceneMultiSelectAttributeDefinition attributeDefinition = new SceneMultiSelectAttributeDefinition(shotlist, this.name);

        for (SceneSelectAttributeOptionTemplate option : options) {
            SceneSelectAttributeOptionDefinition optionDefinition = option.createDefinition(attributeDefinition);
            persist(optionDefinition);
        }

        return attributeDefinition;
    }
}