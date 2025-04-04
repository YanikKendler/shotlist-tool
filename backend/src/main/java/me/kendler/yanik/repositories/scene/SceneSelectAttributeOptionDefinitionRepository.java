package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@ApplicationScoped
public class SceneSelectAttributeOptionDefinitionRepository implements PanacheRepository<SceneSelectAttributeOptionDefinition> {
    @Inject
    SceneAttributeDefinitionRepository sceneAttributeDefinitionRepository;

    public SceneSelectAttributeOptionDefinition create(Long selectAttributeId){
        SceneSelectAttributeOptionDefinition sceneSelectAttributeOptionDefinition = new SceneSelectAttributeOptionDefinition();
        persist(sceneSelectAttributeOptionDefinition);
        sceneAttributeDefinitionRepository.findById(selectAttributeId).addOption(sceneSelectAttributeOptionDefinition);
        return sceneSelectAttributeOptionDefinition;
    }
}
