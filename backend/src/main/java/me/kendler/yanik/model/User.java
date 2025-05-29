package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import me.kendler.yanik.model.template.Template;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "app_user")
public class User extends PanacheEntityBase {
    @Id
    @GeneratedValue
    public UUID id;
    @Column(unique = true)
    public String auth0Sub;
    public String name;
    public String email;
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    public Set<Shotlist> shotlists = new HashSet<>();
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    public Set<Template> templates = new HashSet<>();
    public ZonedDateTime createdAt;
    public boolean isPro = false;

    public User() {
        this.createdAt = ZonedDateTime.now(ZoneOffset.UTC);
    }

    public User(String auth0Sub, String name, String email) {
        this();
        this.auth0Sub = auth0Sub;
        this.name = name;
        this.email = email;
    }

    public boolean equals(User user) {
        return this.id.equals(user.id);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", auth0Sub='" + auth0Sub + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}