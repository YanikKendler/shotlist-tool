package me.kendler.yanik.model.shotlist.shot.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
public class ShotMultiSelectAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotMultiSelectAttributeDefinition definition;
    @OneToMany
    public List<ShotSelectAttributeOptionDefinition> value;
}