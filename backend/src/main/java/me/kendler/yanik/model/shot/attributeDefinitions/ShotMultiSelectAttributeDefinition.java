package me.kendler.yanik.model.shot.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;

@Entity
public class ShotMultiSelectAttributeDefinition extends ShotAttributeDefinitionBase {
    @OneToMany
    public Set<ShotSelectAttributeOptionDefinition> options;

    @Override
    public String getType() {
        return "ShotMultiSelect";
    }

    @Override
    public ShotAttributeBase createAttribute() {
        ShotAttributeBase attribute = new ShotMultiSelectAttribute();
        return null;
    }
}