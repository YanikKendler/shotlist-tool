package me.kendler.yanik.model.shotlist.shot.attributes;

import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotTextAttributeDefinition;

@Entity
public class ShotTextAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotTextAttributeDefinition definition;
    public String value;
}