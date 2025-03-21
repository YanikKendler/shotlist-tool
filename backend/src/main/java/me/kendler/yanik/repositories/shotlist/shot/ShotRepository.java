package me.kendler.yanik.repositories.shotlist.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.shot.Shot;

@ApplicationScoped
public class ShotRepository implements PanacheRepository<Shot> {
}