package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.shot.Shot;

@Entity
@Table(name = "shotnote")
public class ShotNote extends PanacheEntity {
    @ManyToOne
    public Shot shot;
    @ManyToOne
    public User user;
    public String text;
    public LocalDateTime createdAt;

    public ShotNote() {
        this.createdAt = LocalDateTime.now();
    }
}