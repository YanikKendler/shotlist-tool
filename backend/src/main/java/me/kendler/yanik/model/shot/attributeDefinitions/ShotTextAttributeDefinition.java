package me.kendler.yanik.model.shot.attributeDefinitions;

import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.ShotAttributeType;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotTextAttribute;

@Entity
@DiscriminatorValue("ShotText")
public class ShotTextAttributeDefinition extends ShotAttributeDefinitionBase {
    public ShotTextAttributeDefinition() { super(); }

    public ShotTextAttributeDefinition(Shotlist shotlist) {
        super(shotlist);
    }

    public ShotTextAttributeDefinition(Shotlist shotlist, String name) {
        super(shotlist, name);
    }

    @Override
    public ShotAttributeBase createAttribute(Shot shot) {
        return new ShotTextAttribute(this, shot);
    }
}