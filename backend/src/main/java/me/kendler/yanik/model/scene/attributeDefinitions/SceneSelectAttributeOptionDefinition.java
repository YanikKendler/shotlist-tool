package me.kendler.yanik.model.scene.attributeDefinitions;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;

@Entity
@Table(name = "sceneselectattributeoptiondefinition")
public class SceneSelectAttributeOptionDefinition extends PanacheEntity {
    public String name = "";
    @ManyToOne
    public SceneAttributeDefinitionBase sceneAttributeDefinition;

    public SceneSelectAttributeOptionDefinition() { }

    public SceneSelectAttributeOptionDefinition(String name, SceneAttributeDefinitionBase sceneAttributeDefinition) {
        this.name = name;
        this.sceneAttributeDefinition = sceneAttributeDefinition;
    }
}