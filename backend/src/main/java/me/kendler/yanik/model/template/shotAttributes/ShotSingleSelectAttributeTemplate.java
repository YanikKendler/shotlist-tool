package me.kendler.yanik.model.template.shotAttributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateBaseDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotSingleSelectAttributeTemplateDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;

@Entity
public class ShotSingleSelectAttributeTemplate extends ShotAttributeTemplateBase {
    @OneToMany(fetch = FetchType.EAGER)
    public Set<ShotSelectAttributeOptionTemplate> options = new HashSet<>();

    @Override
    public String getType() {
        return "ShotSingleSelect";
    }

    @Override
    public ShotAttributeDefinitionBase createDefinition(Shotlist shotlist) {
        ShotSingleSelectAttributeDefinition attributeDefinition = new ShotSingleSelectAttributeDefinition(shotlist, this.name);

        for (ShotSelectAttributeOptionTemplate option : options) {
            ShotSelectAttributeOptionDefinition optionDefinition = option.createDefinition(attributeDefinition);
            persist(optionDefinition);
        }

        return attributeDefinition;
    }

    @Override
    public ShotAttributeTemplateBaseDTO toDTO() {
        return new ShotSingleSelectAttributeTemplateDTO(
            this.id,
            this.name,
            this.position,
            options.stream().toList()
        );
    }
}