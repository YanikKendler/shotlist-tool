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
    public User owner;
    @ManyToOne
    public Template template;
    @OneToMany(mappedBy = "shotlist", fetch = FetchType.EAGER)
    public Set<Scene> scenes;
    @OneToMany(mappedBy = "shotlist", fetch = FetchType.EAGER)
    public Set<SceneAttributeDefinitionBase> sceneAttributeDefinitions;
    @OneToMany(mappedBy = "shotlist", fetch = FetchType.EAGER)
    public Set<ShotAttributeDefinitionBase> shotAttributeDefinitions;
    public String name;
    public LocalDateTime createdAt;
    public LocalDateTime editedAt;

    public Shotlist() {
        this.createdAt = LocalDateTime.now();
        this.editedAt = LocalDateTime.now();
    }

    public Shotlist(User owner, String name) {
        this();
        this.owner = owner;
        this.name = name;
    }

    public Shotlist(User owner, Template template, String name) {
        this(owner, name);

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

    public void registerEdit() {
        this.editedAt = LocalDateTime.now();
    }
}