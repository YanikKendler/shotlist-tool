package me.kendler.yanik.model.shot.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
public class ShotMultiSelectAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotMultiSelectAttributeDefinition definition;
    @OneToMany
    public List<ShotSelectAttributeOptionDefinition> value;

    public ShotMultiSelectAttribute() { }

    public ShotMultiSelectAttribute(ShotMultiSelectAttributeDefinition definition, Shot shot) {
        super(shot);
        this.definition = definition;
    }
}