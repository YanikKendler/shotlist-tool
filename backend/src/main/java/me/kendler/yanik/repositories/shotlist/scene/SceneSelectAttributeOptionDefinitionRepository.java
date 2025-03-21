package me.kendler.yanik.repositories.shotlist.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@ApplicationScoped
public class SceneSelectAttributeOptionDefinitionRepository implements PanacheRepository<SceneSelectAttributeOptionDefinition> {
}
