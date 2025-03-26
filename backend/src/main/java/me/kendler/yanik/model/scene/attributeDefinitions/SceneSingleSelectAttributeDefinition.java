package me.kendler.yanik.model.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneSingleSelectAttribute;

@Entity
public class SceneSingleSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    @OneToMany
    public Set<SceneSelectAttributeOptionDefinition> options;

    public SceneSingleSelectAttributeDefinition() { super(); }

    public SceneSingleSelectAttributeDefinition(Shotlist shotlist, String name, Set<SceneSelectAttributeOptionDefinition> options) {
        super(shotlist, name);
        this.options = options;
    }

    @Override
    public String getType() {
        return "SceneSingleSelect";
    }

    @Override
    public SceneAttributeBase createAttribute(Scene scene) {
        return new SceneSingleSelectAttribute(this, scene);
    }
}