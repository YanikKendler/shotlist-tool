package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class Collaborator extends PanacheEntity {
    @ManyToOne
    public User user;
    @ManyToOne
    public Shotlist shotlist;
    @Enumerated(EnumType.STRING)
    public CollaboratorRole collaboratorRole;
}

