package me.kendler.yanik.model.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneMultiSelectAttribute;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
public class SceneMultiSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    @OneToMany()
    public Set<SceneSelectAttributeOptionDefinition> options;

    public SceneMultiSelectAttributeDefinition() { super(); }

    public SceneMultiSelectAttributeDefinition(Shotlist shotlist, String name, Set<SceneSelectAttributeOptionDefinition> options) {
        super(shotlist, name);
        this.options = options;
    }

    @Override
    public String getType() {
        return "SceneMultiSelect";
    }

    @Override
    public SceneAttributeBase createAttribute(Scene scene) {
        return new SceneMultiSelectAttribute(this, scene);
    }
}