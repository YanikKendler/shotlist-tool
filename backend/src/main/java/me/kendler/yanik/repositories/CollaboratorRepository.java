package me.kendler.yanik.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.Collaborator;

@ApplicationScoped
public class CollaboratorRepository implements PanacheRepository<Collaborator> {
}
