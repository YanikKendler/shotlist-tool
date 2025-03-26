package me.kendler.yanik.model.scene;

import java.time.LocalDateTime;
import java.util.*;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.Shotlist;

@Entity
public class Scene extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    @OneToMany(mappedBy = "scene")
    public Set<SceneAttributeBase> attributes;
    @OneToMany(mappedBy = "scene")
    public Set<Shot> shots;
    public int number;
    public LocalDateTime createdAt;

    public Scene() {
        this.createdAt = LocalDateTime.now();
    }

    public Scene(Shotlist shotlist, Set<SceneAttributeDefinitionBase> attributeDefinitions, int number) {
        this.shotlist = shotlist;
        this.number = number;

        for (SceneAttributeDefinitionBase attributeDefinition : attributeDefinitions) {
            SceneAttributeBase attribute = attributeDefinition.createAttribute();
            attribute.scene = this;
            this.attributes.add(attribute);
        }

        this.attributes = attributes;
    }
}