package me.kendler.yanik.model.shot.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.scene.attributes.SceneMultiselectAttributeDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotMultiselectAttributeDTO;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
public class ShotMultiSelectAttribute extends ShotAttributeBase {
    @ManyToOne
    public ShotMultiSelectAttributeDefinition definition;
    @OneToMany
    public Set<ShotSelectAttributeOptionDefinition> value = new HashSet<>();

    public ShotMultiSelectAttribute() { }

    public ShotMultiSelectAttribute(ShotMultiSelectAttributeDefinition definition, Shot shot) {
        super(shot);
        this.definition = definition;
    }

    @Override
    public ShotAttributeBaseDTO toDTO() {
        return new ShotMultiselectAttributeDTO(
            id,
            shot,
            definition,
            value
        );
    }
}