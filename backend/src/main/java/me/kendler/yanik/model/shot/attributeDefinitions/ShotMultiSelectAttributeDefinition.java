package me.kendler.yanik.model.shot.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.SceneAttributeType;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.ShotAttributeType;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;

@Entity
@DiscriminatorValue("ShotMultiSelect")
public class ShotMultiSelectAttributeDefinition extends ShotAttributeDefinitionBase {
    @OneToMany(fetch = FetchType.EAGER)
    public Set<ShotSelectAttributeOptionDefinition> options = new HashSet<>();

    public ShotMultiSelectAttributeDefinition() { super(); }

    public ShotMultiSelectAttributeDefinition(Shotlist shotlist) {
        super(shotlist);
    }

    public ShotMultiSelectAttributeDefinition(Shotlist shotlist, String name, Set<ShotSelectAttributeOptionDefinition> options) {
        super(shotlist, name);
        this.options = options;
    }

    @Override
    public ShotAttributeType getType() {
        return ShotAttributeType.ShotMultiSelectAttribute;
    }

    @Override
    public ShotAttributeBase createAttribute(Shot shot) {
        return new ShotMultiSelectAttribute(this, shot);
    }
}