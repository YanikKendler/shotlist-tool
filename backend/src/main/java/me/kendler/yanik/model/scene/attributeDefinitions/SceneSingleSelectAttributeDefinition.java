package me.kendler.yanik.model.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.SceneAttributeType;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneSingleSelectAttribute;

@Entity
@DiscriminatorValue("SceneSingleSelect")
public class SceneSingleSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    public SceneSingleSelectAttributeDefinition() { super(); }

    public SceneSingleSelectAttributeDefinition(Shotlist shotlist) {
        super(shotlist);
    }

    public SceneSingleSelectAttributeDefinition(Shotlist shotlist, String name) {
        super(shotlist, name);
    }

    @Override
    public SceneAttributeBase createAttribute(Scene scene) {
        return new SceneSingleSelectAttribute(this, scene);
    }
}