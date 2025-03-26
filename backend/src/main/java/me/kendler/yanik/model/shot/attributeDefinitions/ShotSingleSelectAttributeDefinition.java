package me.kendler.yanik.model.shot.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class ShotSingleSelectAttributeDefinition extends ShotAttributeDefinitionBase {
    @OneToMany
    public Set<ShotSelectAttributeOptionDefinition> options;
}