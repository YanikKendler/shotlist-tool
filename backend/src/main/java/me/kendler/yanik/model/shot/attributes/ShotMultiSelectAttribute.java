package me.kendler.yanik.model.shot.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.dto.shot.ShotAttributeEditDTO;
import me.kendler.yanik.dto.shot.attributes.ShotMultiSelectAttributeDTO;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

@Entity
public class ShotMultiSelectAttribute extends ShotAttributeBase {
    @OneToMany(fetch = FetchType.EAGER)
    public Set<ShotSelectAttributeOptionDefinition> value = new HashSet<>();

    public ShotMultiSelectAttribute() { }

    public ShotMultiSelectAttribute(ShotMultiSelectAttributeDefinition definition, Shot shot) {
        super(shot, definition);
    }

    @Override
    public ShotAttributeBaseDTO toDTO() {
        return new ShotMultiSelectAttributeDTO(
            id,
            definition,
            value
        );
    }

    @Override
    public void update(ShotAttributeEditDTO editDTO) {
        value = editDTO.multiSelectValue();
    }
}