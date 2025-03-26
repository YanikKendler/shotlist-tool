package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@ApplicationScoped
public class ShotAttributeRepository implements PanacheRepository<ShotAttributeBase> {
}
