package me.kendler.yanik.model.template.shotAttributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.template.sceneAttributes.SceneSelectAttributeOptionTemplate;

@Entity
public class ShotMultiSelectAttributeTemplate extends ShotAttributeTemplateBase {
    @OneToMany(fetch = FetchType.EAGER)
    public Set<ShotSelectAttributeOptionTemplate> options = new HashSet<>();

    @Override
    public String getType() {
        return "ShotMultiSelect";
    }

    @Override
    public ShotAttributeDefinitionBase createDefinition(Shotlist shotlist) {
        ShotMultiSelectAttributeDefinition attributeDefinition = new ShotMultiSelectAttributeDefinition(shotlist, this.name);

        for (ShotSelectAttributeOptionTemplate option : options) {
            ShotSelectAttributeOptionDefinition optionDefinition = option.createDefinition(attributeDefinition);
            persist(optionDefinition);
        }

        return attributeDefinition;
    }
}