package me.kendler.yanik.model.scene.attributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;

@Entity
@Table(name = "sceneattribute")
public abstract class SceneAttributeBase extends PanacheEntity {
    @ManyToOne
    public Scene scene;
    @ManyToOne
    public SceneAttributeDefinitionBase definition;

    public SceneAttributeBase() { }

    public SceneAttributeBase(Scene scene, SceneAttributeDefinitionBase definition) {
        this.scene = scene;
        this.definition = definition;
    }

    public abstract SceneAttributeBaseDTO toDTO();
}