package me.kendler.yanik.model.shot;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.dto.shot.ShotDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
public class Shot extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    @JsonIgnore
    public Scene scene;
    @OneToMany(mappedBy = "shot", fetch = FetchType.EAGER)
    public Set<ShotAttributeBase> attributes = new HashSet<>();
    public int number;
    public boolean isSubshot;
    public LocalDateTime createdAt;

    public Shot() {
        this.createdAt = LocalDateTime.now();
    }

    public Shot(Scene scene) {
        this.scene = scene;
        this.number = scene.shots.size();
        for(ShotAttributeDefinitionBase attributeDefinition : scene.shotlist.shotAttributeDefinitions) {
            ShotAttributeBase attribute = attributeDefinition.createAttribute(this);
            persist(attribute);
            attributes.add(attribute);
        }
    }

    public ShotDTO toDTO() {
        return new ShotDTO(
            this.id,
            this.scene,
            this.attributes.stream().map(ShotAttributeBase::toDTO).collect(Collectors.toSet()),
            this.number,
            this.isSubshot,
            this.createdAt
        );
    }
}