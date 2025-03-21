package me.kendler.yanik.model.shotlist.scene;

import java.time.LocalDateTime;
import java.util.*;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shotlist.shot.Shot;
import me.kendler.yanik.model.shotlist.Shotlist;

@Entity
public class Scene extends PanacheEntity {
    @ManyToOne
    public Shotlist shotlist;
    @OneToMany(mappedBy = "scene")
    public Set<SceneAttributeBase> attributes;
    @OneToMany(mappedBy = "scene")
    public Set<Shot> shots;
    public int number;
    public LocalDateTime createdAt;

    public Scene() {
        this.createdAt = LocalDateTime.now();
    }
}