package me.kendler.yanik.model.shotlist.shot.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class ShotSelectAttributeOptionDefinition extends PanacheEntity {
    public String name;
    public int position;
}