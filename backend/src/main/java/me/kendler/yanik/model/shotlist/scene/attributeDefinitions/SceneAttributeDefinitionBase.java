package me.kendler.yanik.model.shotlist.scene.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.Shotlist;

@Entity
@Table(name = "sceneattributedefinition")
public abstract class SceneAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    public String name;
    public int position;
}