package me.kendler.yanik.model.shot.attributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import me.kendler.yanik.model.shot.Shot;

@Entity
@Table(name = "shotattribute")
public abstract class ShotAttributeBase extends PanacheEntity {
    @ManyToOne
    public Shot shot;
}
