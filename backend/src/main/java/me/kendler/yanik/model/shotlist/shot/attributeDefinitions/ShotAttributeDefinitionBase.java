package me.kendler.yanik.model.shotlist.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.shotlist.Shotlist;

@Entity
@Table(name = "shotattributedefinition")
public abstract class ShotAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    String name;
    int position;
}
