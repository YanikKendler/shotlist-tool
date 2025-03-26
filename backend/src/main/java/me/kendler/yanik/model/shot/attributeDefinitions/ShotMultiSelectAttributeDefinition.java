package me.kendler.yanik.model.shot.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;

@Entity
public class ShotMultiSelectAttributeDefinition extends ShotAttributeDefinitionBase {
    @OneToMany
    public Set<ShotSelectAttributeOptionDefinition> options;

    public ShotMultiSelectAttributeDefinition() { super(); }

    public ShotMultiSelectAttributeDefinition(Shotlist shotlist, String name, Set<ShotSelectAttributeOptionDefinition> options) {
        super(shotlist, name);
        this.options = options;
    }

    @Override
    public String getType() {
        return "ShotMultiSelect";
    }

    @Override
    public ShotAttributeBase createAttribute(Shot shot) {
        return new ShotMultiSelectAttribute(this, shot);
    }
}