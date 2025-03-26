package me.kendler.yanik.model.shot.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class ShotSingleSelectAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotSingleSelectAttributeDefinition definition;
    @ManyToOne
    public ShotSelectAttributeOptionDefinition value;
}