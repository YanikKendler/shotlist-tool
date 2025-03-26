package me.kendler.yanik.model.scene.attributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.scene.Scene;

@Entity
@Table(name = "sceneattribute")
public abstract class SceneAttributeBase extends PanacheEntity {
    @ManyToOne
    public Scene scene;
}