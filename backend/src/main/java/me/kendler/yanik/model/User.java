package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.template.Template;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "app_user")
public class User extends PanacheEntityBase {
    @Id
    public String id;
    public String name;
    public String email;
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    public Set<Shotlist> shotlists;
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    public Set<Template> templates;
    public LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String id) {
        this();
        this.id = id;
    }

    public User(String id, String name, String email) {
        this(id);
        this.name = name;
        this.email = email;
    }
}