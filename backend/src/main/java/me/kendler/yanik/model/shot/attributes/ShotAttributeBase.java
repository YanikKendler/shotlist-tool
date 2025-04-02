package me.kendler.yanik.model.shot.attributes;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.shot.Shot;

@Entity
@Table(name = "shotattribute")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class ShotAttributeBase extends PanacheEntity {
    @ManyToOne
    public Shot shot;

    public ShotAttributeBase() { }

    public ShotAttributeBase(Shot shot) {
        this.shot = shot;
        shot.attributes.add(this);
    }

    public abstract ShotAttributeBaseDTO toDTO();
}
