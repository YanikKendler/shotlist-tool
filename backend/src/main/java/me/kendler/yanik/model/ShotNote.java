package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.model.shot.Shot;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

@Entity
@Table(name = "shotnote")
public class ShotNote extends PanacheEntity {
    @ManyToOne
    public Shot shot;
    @ManyToOne
    public User user;
    public String text;
    public ZonedDateTime createdAt;

    public ShotNote() {
        this.createdAt = ZonedDateTime.now(ZoneOffset.UTC);
    }
}