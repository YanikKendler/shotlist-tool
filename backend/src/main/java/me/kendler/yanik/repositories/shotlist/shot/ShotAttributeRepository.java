package me.kendler.yanik.repositories.shotlist.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.shot.attributes.ShotAttributeBase;

@ApplicationScoped
public class ShotAttributeRepository implements PanacheRepository<ShotAttributeBase> {
}
