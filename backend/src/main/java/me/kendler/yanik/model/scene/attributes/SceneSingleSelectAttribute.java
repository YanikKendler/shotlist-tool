package me.kendler.yanik.model.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class SceneSingleSelectAttribute extends SceneAttributeBase {
    @ManyToOne
    public SceneSingleSelectAttributeDefinition definition;
    @ManyToOne
    public SceneSelectAttributeOptionDefinition value;

    public SceneSingleSelectAttribute() { super(); }

    public SceneSingleSelectAttribute(SceneSingleSelectAttributeDefinition definition, Scene scene) {
        super(scene);
        this.definition = definition;
    }
}