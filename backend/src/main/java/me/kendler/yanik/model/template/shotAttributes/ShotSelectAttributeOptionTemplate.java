package me.kendler.yanik.model.template.shotAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "shotselectattributeoptiontemplate")
public class ShotSelectAttributeOptionTemplate extends PanacheEntity {
    public String name;
    public int position;
}