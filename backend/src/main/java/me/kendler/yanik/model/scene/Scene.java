package me.kendler.yanik.model.scene;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.JsonFormat;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@Entity
public class Scene extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @ManyToOne
    @JsonIgnore
    public Shotlist shotlist;
    @OneToMany(fetch = FetchType.EAGER)
    public Set<SceneAttributeBase> attributes = new HashSet<>();
    @OneToMany(mappedBy = "scene", fetch = FetchType.EAGER)
    public Set<Shot> shots = new HashSet<>();
    public int number;
    public LocalDateTime createdAt;

    public Scene() {
        this.createdAt = LocalDateTime.now();
    }

    public Scene(Shotlist shotlist) {
        this();
        this.shotlist = shotlist;
        this.number = shotlist.scenes.size();
        shotlist.scenes.add(this);

        // create attribute instances based on all the attribute definitions stored in the shotlist
        for (SceneAttributeDefinitionBase attributeDefinition : shotlist.sceneAttributeDefinitions) {
            SceneAttributeBase attribute = attributeDefinition.createAttribute(this);
            this.attributes.add(attribute);
            persist(attribute);
        }
    }

    public SceneDTO toDTO() {
        return new SceneDTO(
            this.id,
            this.shotlist,
            this.attributes.stream()
                    .sorted(Comparator.comparingInt(attr -> attr.definition.position))
                    .map(SceneAttributeBase::toDTO)
                    .collect(Collectors.toList()),
            this.shots.stream()
                    .sorted(Comparator.comparingInt(shot -> shot.number))
                    .map(Shot::toDTO)
                    .collect(Collectors.toList()),
            this.number,
            this.createdAt
        );
    }
}