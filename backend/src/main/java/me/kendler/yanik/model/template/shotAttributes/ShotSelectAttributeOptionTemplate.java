package me.kendler.yanik.model.template.shotAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
@Table(name = "shotselectattributeoptiontemplate")
public class ShotSelectAttributeOptionTemplate extends PanacheEntity {
    public String name;
    public int position;

    public ShotSelectAttributeOptionTemplate() { }

    public ShotSelectAttributeOptionTemplate(String name, int position) {
        this.name = name;
        this.position = position;
    }

    public ShotSelectAttributeOptionDefinition createDefinition() {
        return new ShotSelectAttributeOptionDefinition(this.name, this.position);
    }
}