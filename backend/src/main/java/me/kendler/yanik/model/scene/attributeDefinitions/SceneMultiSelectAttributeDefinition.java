package me.kendler.yanik.model.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.SceneAttributeType;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneMultiSelectAttribute;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
@DiscriminatorValue("SceneMultiSelect")
public class SceneMultiSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    public SceneMultiSelectAttributeDefinition() { super(); }

    public SceneMultiSelectAttributeDefinition(Shotlist shotlist) {
        super(shotlist);
    }

    public SceneMultiSelectAttributeDefinition(Shotlist shotlist, String name) {
        super(shotlist, name);
    }

    @Override
    public SceneAttributeType getType() {
        return SceneAttributeType.SceneMultiSelectAttribute;
    }

    @Override
    public SceneAttributeBase createAttribute(Scene scene) {
        return new SceneMultiSelectAttribute(this, scene);
    }
}