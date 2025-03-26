package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shot.Shot;

@ApplicationScoped
public class ShotRepository implements PanacheRepository<Shot> {
}