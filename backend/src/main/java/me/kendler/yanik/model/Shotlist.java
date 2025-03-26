package me.kendler.yanik.model;

import java.util.*;
import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.model.template.sceneAttributes.SceneAttributeTemplateBase;
import me.kendler.yanik.model.template.shotAttributes.ShotAttributeTemplateBase;

@Entity
@Table(name = "shotlist")
public class Shotlist extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    public User user;
    @ManyToOne
    public Template template;
    @OneToMany(mappedBy = "shotlist")
    public Set<Scene> scenes;
    @OneToMany(mappedBy = "shotlist")
    public Set<SceneAttributeDefinitionBase> sceneAttributeDefinitions;
    @OneToMany(mappedBy = "shotlist")
    public Set<ShotAttributeDefinitionBase> shotAttributeDefinitions;
    public String name;
    public LocalDateTime createdAt;

    public Shotlist() {
        this.createdAt = LocalDateTime.now();
    }

    public Shotlist(User user, String name) {
        this();
        this.user = user;
        this.name = name;
    }

    public Shotlist(User user, Template template, String name) {
        this(user, name);

        this.template = template;

        //copy all scene attributes from the template
        for (SceneAttributeTemplateBase sceneAttributeTemplate : template.sceneAttributes) {
            SceneAttributeDefinitionBase attributeDefinition = sceneAttributeTemplate.createDefinition(this);
            persist(attributeDefinition);
            sceneAttributeDefinitions.add(attributeDefinition);
        }

        //copy all shot attributes from the template
        for (ShotAttributeTemplateBase shotAttributeTemplate : template.shotAttributes) {
            ShotAttributeDefinitionBase attributeDefinition = shotAttributeTemplate.createDefinition(this);
            persist(attributeDefinition);
            shotAttributeDefinitions.add(attributeDefinition);
        }
    }
}