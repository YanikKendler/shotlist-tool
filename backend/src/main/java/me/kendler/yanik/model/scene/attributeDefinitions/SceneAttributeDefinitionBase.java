package me.kendler.yanik.model.scene.attributeDefinitions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.SceneAttributeType;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.Shot;

/**
 * Base class for scene attribute definitions.
 * Defines all the attributes that every single scene in a shotlist has, stores the selection options and names for those attributes.
 */
@Entity
@Table(name = "sceneattributedefinition")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class SceneAttributeDefinitionBase extends PanacheEntity {
    @ManyToOne
    @JsonIgnore
    public Shotlist shotlist;
    public String name;
    public int position;

    public SceneAttributeDefinitionBase() { }

    public SceneAttributeDefinitionBase(Shotlist shotlist, String name) {
        this.shotlist = shotlist;
        this.name = name;
        this.position = shotlist.sceneAttributeDefinitions.size();
        shotlist.sceneAttributeDefinitions.add(this);
        System.out.println(shotlist);
    }

    abstract public SceneAttributeType getType();

    abstract public SceneAttributeBase createAttribute(Scene scene);

    @Override
    public String toString() {
        return "SceneAttributeDefinition{" +
                ", name='" + name + '\'' +
                ", position=" + position +
                '}';
    }
}