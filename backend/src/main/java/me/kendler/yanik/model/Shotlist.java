package me.kendler.yanik.model;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.dto.shotlist.ShotlistDTO;
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
    @JsonIgnore
    public User owner;
    @ManyToOne
    public Template template;

    @OneToMany(mappedBy = "shotlist", fetch = FetchType.EAGER)
    public Set<Scene> scenes = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER)
    public Set<SceneAttributeDefinitionBase> sceneAttributeDefinitions = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER)
    public Set<ShotAttributeDefinitionBase> shotAttributeDefinitions = new HashSet<>();

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

    public ShotlistDTO toDTO() {
        return new ShotlistDTO(
            this.id,
            this.owner,
            this.template,
            this.scenes.stream()
                    .sorted(Comparator.comparingInt(scene -> scene.number))
                    .map(Scene::toDTO)
                    .collect(Collectors.toList()),
            this.sceneAttributeDefinitions.stream()
                    .sorted(Comparator.comparingInt(definition -> definition.position))
                    .collect(Collectors.toList()),
            this.shotAttributeDefinitions.stream()
                    .sorted(Comparator.comparingInt(definition -> definition.position))
                    .collect(Collectors.toList()),
            this.name,
            this.createdAt,
            this.editedAt
        );
    }

    @Override
    public String toString() {
        return "Shotlist{" +
            "id=" + id +
            ", owner=" + owner +
            ", template=" + template +
            ", scenes=" + scenes +
            ", sceneAttributeDefinitions=" + sceneAttributeDefinitions +
            ", shotAttributeDefinitions=" + shotAttributeDefinitions +
            ", name='" + name + '\'' +
            ", createdAt=" + createdAt +
            ", editedAt=" + editedAt +
            '}';
    }
}