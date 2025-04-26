package me.kendler.yanik.model.shot;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.dto.shot.ShotDTO;
import me.kendler.yanik.model.scene.Scene;
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
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    public Set<ShotAttributeBase> attributes = new HashSet<>();
    public int position;
    public boolean isSubshot;
    public LocalDateTime createdAt;

    public Shot() {
        this.createdAt = LocalDateTime.now();
    }

    public Shot(Scene scene) {
        this.scene = scene;
        this.position = scene.shots.size();
        scene.shots.add(this);
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
            this.attributes.stream()
                    .sorted(Comparator.comparingInt(attr -> attr.definition.position))
                    .map(ShotAttributeBase::toDTO)
                    .collect(Collectors.toList()),
            this.position,
            this.isSubshot,
            this.createdAt
        );
    }
}