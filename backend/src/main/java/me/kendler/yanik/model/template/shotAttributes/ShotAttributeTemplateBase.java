package me.kendler.yanik.model.template.shotAttributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.template.Template;

@Entity
@Table(name = "shotattributetemplate")
public class ShotAttributeTemplateBase extends PanacheEntity {
    @ManyToOne
    public Template template;
    public String name;
    public int position;
}
