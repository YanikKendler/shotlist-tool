package me.kendler.yanik.model.scene.attributeDefinitions;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.SceneAttributeType;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneTextAttribute;

@Entity
@DiscriminatorValue("SceneText")
public class SceneTextAttributeDefinition extends SceneAttributeDefinitionBase {
    public SceneTextAttributeDefinition() { super(); }

    public SceneTextAttributeDefinition(Shotlist shotlist) {
        super(shotlist);
    }

    public SceneTextAttributeDefinition(Shotlist shotlist, String name) {
        super(shotlist, name);
    }

    @Override
    public SceneAttributeBase createAttribute(Scene scene) {
        return new SceneTextAttribute(this, scene);
    }
}