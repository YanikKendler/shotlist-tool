package me.kendler.yanik.model.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class ShotSelectAttributeOptionDefinition extends PanacheEntity {
    public String name;
    public int position;

    public ShotSelectAttributeOptionDefinition() { }

    public ShotSelectAttributeOptionDefinition(String name, int position) {
        this.name = name;
        this.position = position;
    }
}