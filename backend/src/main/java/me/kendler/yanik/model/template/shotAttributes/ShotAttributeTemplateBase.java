package me.kendler.yanik.model.template.shotAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributeDefinitions.SceneAttributeDefinitionBaseDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateBaseDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.template.Template;

@Entity
@Table(name = "shotattributetemplate")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ShotAttributeTemplateBase extends PanacheEntity {
    @ManyToOne
    public Template template;
    public String name;
    public int position;

    abstract public String getType();

    abstract public ShotAttributeDefinitionBase createDefinition(Shotlist shotlist);

    public abstract ShotAttributeTemplateBaseDTO toDTO();

}
