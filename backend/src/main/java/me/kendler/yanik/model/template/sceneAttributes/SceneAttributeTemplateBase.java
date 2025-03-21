package me.kendler.yanik.model.template.sceneAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.template.Template;

@Entity
@Table(name = "sceneattributetemplate")
public class SceneAttributeTemplateBase extends PanacheEntity {
    @ManyToOne
    public Template template;
    public String name;
    public int position;
}
