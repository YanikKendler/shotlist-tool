package me.kendler.yanik.model.template.sceneAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class SceneSelectAttributeOptionTemplate extends PanacheEntity {
    public String name;
    public int position;
}