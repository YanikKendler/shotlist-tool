package me.kendler.yanik.model.scene;

import java.time.LocalDateTime;
import java.util.*;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.Shotlist;

@Entity
public class Scene extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    public Shotlist shotlist;
    @OneToMany(mappedBy = "scene", fetch = FetchType.EAGER)
    public Set<SceneAttributeBase> attributes;
    @OneToMany(mappedBy = "scene", fetch = FetchType.EAGER)
    public Set<Shot> shots;
    public int number;
    public LocalDateTime createdAt;

    public Scene() {
        this.createdAt = LocalDateTime.now();
    }

    public Scene(Shotlist shotlist) {
        this();
        this.shotlist = shotlist;
        this.number = shotlist.scenes.size();

        // create attribute instances based on all the attribute definitions stored in the shotlist
        for (SceneAttributeDefinitionBase attributeDefinition : shotlist.sceneAttributeDefinitions) {
            SceneAttributeBase attribute = attributeDefinition.createAttribute(this);
            this.attributes.add(attribute);
            persist(attribute);
        }
    }
}