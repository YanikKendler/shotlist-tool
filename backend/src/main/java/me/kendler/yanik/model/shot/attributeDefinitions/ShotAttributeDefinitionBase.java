package me.kendler.yanik.model.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
@Table(name = "shotattributedefinition")
public abstract class ShotAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    String name;
    int position;

    abstract public String getType();

    abstract public ShotAttributeBase createAttribute();
}
