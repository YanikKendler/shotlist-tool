package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.SceneSelectAttributeOptionSearchDTO;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

import java.util.List;

@ApplicationScoped
public class SceneSelectAttributeOptionDefinitionRepository implements PanacheRepository<SceneSelectAttributeOptionDefinition> {
    @Inject
    SceneAttributeDefinitionRepository sceneAttributeDefinitionRepository;

    public SceneSelectAttributeOptionDefinition create(Long selectAttributeId){
        SceneAttributeDefinitionBase sceneAttributeDefinition = sceneAttributeDefinitionRepository.findById(selectAttributeId);
        SceneSelectAttributeOptionDefinition sceneSelectAttributeOptionDefinition = new SceneSelectAttributeOptionDefinition(sceneAttributeDefinition);
        persist(sceneSelectAttributeOptionDefinition);
        return sceneSelectAttributeOptionDefinition;
    }

    public List<SceneSelectAttributeOptionDefinition> search(SceneSelectAttributeOptionSearchDTO searchDTO){
        return find("sceneAttributeDefinition.id = ?1 and name like %?2%", searchDTO.SceneAttributeDefinitionId(), searchDTO.searchTerm()).list();
    }

    public SceneSelectAttributeOptionDefinition delete(Long id){
        SceneSelectAttributeOptionDefinition sceneSelectAttributeOptionDefinition = findById(id);
        if(sceneSelectAttributeOptionDefinition != null) {
            delete(sceneSelectAttributeOptionDefinition);
        }
        return sceneSelectAttributeOptionDefinition;
    }
}
