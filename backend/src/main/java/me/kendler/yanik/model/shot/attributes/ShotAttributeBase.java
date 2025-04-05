package me.kendler.yanik.model.shot.attributes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeEditDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeEditDTO;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
@Table(name = "shotattribute")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ShotAttributeBase extends PanacheEntity {
    /*@ManyToOne
    @JsonIgnore
    public Shot shot;*/
    @ManyToOne
    public ShotAttributeDefinitionBase definition;

    public ShotAttributeBase() { }

    public ShotAttributeBase(Shot shot, ShotAttributeDefinitionBase definition) {
        /*this.shot = shot;*/
        shot.attributes.add(this);
        this.definition = definition;
    }

    public abstract ShotAttributeBaseDTO toDTO();

    abstract public void update(ShotAttributeEditDTO editDTO);
}
