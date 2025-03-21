package me.kendler.yanik.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User extends PanacheEntityBase {
    @Id
    public String id;
    public String username;
    public String email;
}