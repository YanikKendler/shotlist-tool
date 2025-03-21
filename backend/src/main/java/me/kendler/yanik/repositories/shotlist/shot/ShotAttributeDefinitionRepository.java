package me.kendler.yanik.repositories.shotlist.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.shot.attributeDefinitions.ShotAttributeDefinitionBase;

@ApplicationScoped
public class ShotAttributeDefinitionRepository implements PanacheRepository<ShotAttributeDefinitionBase> {
}
