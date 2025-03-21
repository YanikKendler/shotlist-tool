package me.kendler.yanik.repositories.shotlist.scene;


import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.scene.attributeDefinitions.SceneAttributeDefinitionBase;

@ApplicationScoped
public class SceneAttributeDefinitionRepository implements PanacheRepository<SceneAttributeDefinitionBase> {

}
