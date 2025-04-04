package me.kendler.yanik.model.scene.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;

@Entity
@Table(name = "sceneselectattributeoptiondefinition")
public class SceneSelectAttributeOptionDefinition extends PanacheEntity {
    public String name;
    public int position;
    @ManyToOne
    SceneAttributeDefinitionBase sceneAttributeDefinition;

    public SceneSelectAttributeOptionDefinition() { }

    public SceneSelectAttributeOptionDefinition(SceneAttributeDefinitionBase sceneAttributeDefinition) {
        this.sceneAttributeDefinition = sceneAttributeDefinition;
    }

    public SceneSelectAttributeOptionDefinition(String name, int position, SceneAttributeDefinitionBase sceneAttributeDefinition) {
        this(sceneAttributeDefinition);
        this.name = name;
        this.position = position;
    }
}