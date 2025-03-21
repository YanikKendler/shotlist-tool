package me.kendler.yanik.model.shotlist.shot.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class ShotSingleSelectAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotSingleSelectAttributeDefinition definition;
    @ManyToOne
    public ShotSelectAttributeOptionDefinition value;
}