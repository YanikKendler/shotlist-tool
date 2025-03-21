package me.kendler.yanik.model.shotlist.scene.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class SceneSingleSelectAttribute extends SceneAttributeBase {
    @ManyToOne
    public ShotSingleSelectAttributeDefinition definition;
    @ManyToOne
    public ShotSelectAttributeOptionDefinition value;
}