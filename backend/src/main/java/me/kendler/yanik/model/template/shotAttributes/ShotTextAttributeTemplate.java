package me.kendler.yanik.model.template.shotAttributes;

import jakarta.persistence.*;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateBaseDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotTextAttributeTemplateDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotTextAttributeDefinition;

@Entity
public class ShotTextAttributeTemplate extends ShotAttributeTemplateBase {
    @Override
    public String getType() {
        return "ShotText";
    }

    @Override
    public ShotAttributeDefinitionBase createDefinition(Shotlist shotlist) {
        return new ShotTextAttributeDefinition(shotlist, name);
    }

    @Override
    public ShotAttributeTemplateBaseDTO toDTO() {
        return new ShotTextAttributeTemplateDTO(
            this.id,
            this.name,
            this.position
        );
    }
}