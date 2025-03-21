package me.kendler.yanik.model.shotlist.shot.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class ShotSingleSelectAttributeDefinition extends ShotAttributeDefinitionBase {
    @OneToMany
    public Set<ShotSelectAttributeOptionDefinition> options;
}