package me.kendler.yanik.model.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneTextAttributeDefinition;

@Entity
public class SceneTextAttribute extends SceneAttributeBase {
    @ManyToOne
    public SceneTextAttributeDefinition definition;
    public String value;
}