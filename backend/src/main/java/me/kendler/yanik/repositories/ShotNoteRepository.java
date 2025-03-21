package me.kendler.yanik.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.ShotNote;

@ApplicationScoped
public class ShotNoteRepository implements PanacheRepository<ShotNote> {
}
