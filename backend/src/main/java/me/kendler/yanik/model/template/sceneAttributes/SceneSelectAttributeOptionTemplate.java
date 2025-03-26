package me.kendler.yanik.model.template.sceneAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@Entity
public class SceneSelectAttributeOptionTemplate extends PanacheEntity {
    public String name;
    public int position;

    public SceneSelectAttributeOptionTemplate() { }

    public SceneSelectAttributeOptionTemplate(String name, int position) {
        this.name = name;
        this.position = position;
    }

    public SceneSelectAttributeOptionDefinition createDefinition() {
        return new SceneSelectAttributeOptionDefinition(this.name, this.position);
    }
}