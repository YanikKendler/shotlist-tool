package me.kendler.yanik.model.shot;

import java.time.LocalDateTime;
import java.util.*;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
public class Shot extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    public Scene scene;
    @OneToMany(mappedBy = "shot")
    public Set<ShotAttributeBase> attributes;
    public int number;
    public boolean isSubshot;
    public LocalDateTime createdAt;

    public Shot() {
        this.createdAt = LocalDateTime.now();
    }

    public Shot(Scene scene) {
        this.scene = scene;
        this.number = scene.shots.size();
        for(ShotAttributeDefinitionBase attributeDefinition : scene.shotlist.shotAttributeDefinitions) {
            ShotAttributeBase attribute = attributeDefinition.createAttribute(this);
            persist(attribute);
            attributes.add(attribute);
        }
    }
}