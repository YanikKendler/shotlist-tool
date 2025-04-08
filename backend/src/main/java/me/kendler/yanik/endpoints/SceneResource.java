package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.*;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.repositories.scene.SceneAttributeDefinitionRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeRepository;
import me.kendler.yanik.repositories.scene.SceneRepository;
import me.kendler.yanik.repositories.scene.SceneSelectAttributeOptionDefinitionRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class SceneResource {
    @Inject
    SceneRepository sceneRepository;

    @Query
    public List<SceneDTO> getScenes(UUID shotlistId) {
        return sceneRepository.list("shotlist.id", shotlistId).stream().map(Scene::toDTO).toList();
    }

    @Mutation
    public SceneDTO createScene(UUID shotlistId) {
        return sceneRepository.create(shotlistId).toDTO();
    }

    @Mutation
    public SceneDTO deleteScene(UUID id) {
        return sceneRepository.delete(id).toDTO();
    }

    /*
    * ATTRIBUTE DEFINITIONS
    */

    @Inject
    SceneAttributeDefinitionRepository sceneAttributeDefinitionRepository;

    @Query
    public List<SceneAttributeDefinitionBase> getSceneAttributeDefinitions(UUID shotlistId){
        return sceneAttributeDefinitionRepository.list("shotlist.id", shotlistId);
    }

    @Mutation
    public SceneAttributeDefinitionBase createSceneAttributeDefinition(SceneAttributeDefinitionCreateDTO createDTO){
        return sceneAttributeDefinitionRepository.create(createDTO);
    }

    @Mutation
    public SceneAttributeDefinitionBase deleteSceneAttributeDefinition(Long id){
        return sceneAttributeDefinitionRepository.delete(id);
    }

    @Mutation
    public SceneAttributeDefinitionBase updateSceneAttributeDefinition(SceneAttributeDefinitionEditDTO editDTO) {
        return sceneAttributeDefinitionRepository.update(editDTO);
    }

    /*
    * ATTRIBUTES
    */

    @Inject
    SceneAttributeRepository sceneAttributeRepository;

    @Mutation
    public SceneAttributeBase updateSceneAttribute(SceneAttributeEditDTO editDTO) {
        return sceneAttributeRepository.update(editDTO);
    }

    /*
    * SELECT OPTIONS
    */

    @Inject
    SceneSelectAttributeOptionDefinitionRepository sceneSelectAttributeOptionDefinitionRepository;

    @Query
    public List<SceneSelectAttributeOptionDefinition> getSceneSelectAttributeOptions(Long attributeDefinitionId) {
        return sceneSelectAttributeOptionDefinitionRepository.list("sceneSelectAttributeDefinition.id order by name", attributeDefinitionId);
    }

    @Query
    public List<SceneSelectAttributeOptionDefinition> searchSceneSelectAttributeOptions(SceneSelectAttributeOptionSearchDTO searchDTO){
        return sceneSelectAttributeOptionDefinitionRepository.search(searchDTO);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition createSceneSelectAttributeOption(SceneSelectAttributeCreateDTO createDTO){
        return sceneSelectAttributeOptionDefinitionRepository.create(createDTO);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition deleteSceneSelectAttributeOption(Long id){
        return sceneSelectAttributeOptionDefinitionRepository.delete(id);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition updateSceneSelectAttributeOption(SceneSelectAttributeOptionEditDTO editDTO) {
        return sceneSelectAttributeOptionDefinitionRepository.update(editDTO);
    }
}
