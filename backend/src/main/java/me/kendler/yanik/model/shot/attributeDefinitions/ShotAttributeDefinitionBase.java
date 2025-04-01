package me.kendler.yanik.model.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
@Table(name = "shotattributedefinition")
public abstract class ShotAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    String name;
    int position;

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
