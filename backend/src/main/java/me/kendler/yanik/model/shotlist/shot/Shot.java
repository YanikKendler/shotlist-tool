package me.kendler.yanik.model.shotlist.shot;

import java.time.LocalDateTime;
import java.util.*;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.scene.Scene;
import me.kendler.yanik.model.shotlist.shot.attributes.ShotAttributeBase;

@Entity
public class Shot extends PanacheEntity {
    @ManyToOne
    public Scene scene;
    @OneToMany(mappedBy = "shot")
    public Set<ShotAttributeBase> attributes;
    public int number;
    public boolean isSubshot;
    public LocalDateTime createdAt;

    public Shot() {
        this.createdAt = LocalDateTime.now();
    }
}