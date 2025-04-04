package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionCreateDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.repositories.scene.SceneAttributeDefinitionRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeRepository;
import me.kendler.yanik.repositories.scene.SceneRepository;
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

    @Inject
    SceneAttributeRepository sceneAttributeRepository;

    @Query
    public List<SceneAttributeBaseDTO> getSceneAttributes(UUID sceneId){
        return sceneAttributeRepository.list("scene.id", sceneId).stream().map(SceneAttributeBase::toDTO).toList();
    }

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
}
