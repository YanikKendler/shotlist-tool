package me.kendler.yanik.model;

import java.util.*;
import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.template.Template;

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

    public Shotlist(User user, Template template, String name) {
        this();
        this.user = user;
        this.template = template;
        this.name = name;
    }
}