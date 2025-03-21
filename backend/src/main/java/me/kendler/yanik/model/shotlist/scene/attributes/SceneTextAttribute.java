package me.kendler.yanik.model.shotlist.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.scene.attributeDefinitions.SceneTextAttributeDefinition;

@Entity
public class SceneTextAttribute extends SceneAttributeBase {
    @ManyToOne
    public SceneTextAttributeDefinition definition;
    public String value;
}