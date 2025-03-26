package me.kendler.yanik.model.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class SceneSingleSelectAttribute extends SceneAttributeBase {
    @ManyToOne
    public ShotSingleSelectAttributeDefinition definition;
    @ManyToOne
    public ShotSelectAttributeOptionDefinition value;
}