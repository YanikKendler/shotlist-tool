package me.kendler.yanik.model.shotlist;

import java.util.*;
import java.time.LocalDateTime;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.shotlist.scene.Scene;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.model.User;

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
    public String name;
    public LocalDateTime createdAt;

    public Shotlist(User user, Template template, String name) {
        this();
        this.user = user;
        this.template = template;
        this.name = name;
    }

    public Shotlist() {
        this.createdAt = LocalDateTime.now();
    }
}