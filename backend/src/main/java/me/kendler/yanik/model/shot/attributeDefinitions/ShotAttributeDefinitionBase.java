package me.kendler.yanik.model.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

/**
 * Base class for shit attribute definitions.
 * Defines all the attributes that every single shot in a shotlist has, stores the selection options and names for those attributes.
 */
@Entity
@Table(name = "shotattributedefinition")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ShotAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    public String name;
    public int position;

    public ShotAttributeDefinitionBase() { }

    public ShotAttributeDefinitionBase(Shotlist shotlist, String name) {
        this.shotlist = shotlist;
        this.name = name;
        this.position = shotlist.shotAttributeDefinitions.size();
        shotlist.shotAttributeDefinitions.add(this);
    }

    abstract public String getType();

    abstract public ShotAttributeBase createAttribute(Shot shot);
}
