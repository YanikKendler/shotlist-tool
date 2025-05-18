package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.*;
import me.kendler.yanik.dto.scene.attributeDefinitions.SceneAttributeDefinitionBaseDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.repositories.UserRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeDefinitionRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeRepository;
import me.kendler.yanik.repositories.scene.SceneRepository;
import me.kendler.yanik.repositories.scene.SceneSelectAttributeOptionDefinitionRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class SceneResource {
    @Inject
    JsonWebToken jwt;

    @Inject
    SceneRepository sceneRepository;

    @Inject
    UserRepository userRepository;

    @Query
    public List<SceneDTO> getScenes(UUID shotlistId) {
        userRepository.checkUserAccessRights(shotlistId, jwt);

        return sceneRepository.list("shotlist.id", shotlistId).stream().map(Scene::toDTO).toList();
    }

    @Mutation
    public SceneDTO createScene(UUID shotlistId) {
        userRepository.checkUserAccessRights(shotlistId, jwt);

        return sceneRepository.create(shotlistId).toDTO();
    }

    @Mutation
    public SceneDTO deleteScene(UUID id) {
        userRepository.checkUserAccessRights(sceneRepository.findById(id).shotlist, jwt);

        return sceneRepository.delete(id).toDTO();
    }

    @Mutation
    public SceneDTO updateScene(SceneEditDTO editDTO) {
        userRepository.checkUserAccessRights(sceneRepository.findById(editDTO.id()).shotlist, jwt);

        return sceneRepository.update(editDTO).toDTO();
    }

    /*
    * ATTRIBUTE DEFINITIONS
    */

    @Inject
    SceneAttributeDefinitionRepository sceneAttributeDefinitionRepository;

    @Query
    public List<SceneAttributeDefinitionBaseDTO> getSceneAttributeDefinitions(UUID shotlistId){
        userRepository.checkUserAccessRights(shotlistId, jwt);

        return sceneAttributeDefinitionRepository.getAll(shotlistId);
    }

    @Mutation
    public SceneAttributeDefinitionBaseDTO createSceneAttributeDefinition(SceneAttributeDefinitionCreateDTO createDTO){
        userRepository.checkUserAccessRights(createDTO.shotlistId(), jwt);

        return sceneAttributeDefinitionRepository.create(createDTO).toDTO();
    }

    @Mutation
    public SceneAttributeDefinitionBase deleteSceneAttributeDefinition(Long id){
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(id), jwt);

        return sceneAttributeDefinitionRepository.delete(id);
    }

    @Mutation
    public SceneAttributeDefinitionBase updateSceneAttributeDefinition(SceneAttributeDefinitionEditDTO editDTO) {
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(editDTO.id()), jwt);

        return sceneAttributeDefinitionRepository.update(editDTO);
    }

    /*
    * ATTRIBUTES
    */

    @Inject
    SceneAttributeRepository sceneAttributeRepository;

    @Mutation
    public SceneAttributeBase updateSceneAttribute(SceneAttributeEditDTO editDTO) {
        SceneAttributeDefinitionBase sceneAttributeDefinition = sceneAttributeRepository.findById(editDTO.id()).definition;
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(sceneAttributeDefinition.id), jwt);

        return sceneAttributeRepository.update(editDTO);
    }

    /*
    * SELECT OPTIONS
    */

    @Inject
    SceneSelectAttributeOptionDefinitionRepository sceneSelectAttributeOptionDefinitionRepository;

    @Query
    public List<SceneSelectAttributeOptionDefinition> getSceneSelectAttributeOptions(Long attributeDefinitionId) {
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(attributeDefinitionId), jwt);

        return sceneSelectAttributeOptionDefinitionRepository.list("sceneSelectAttributeDefinition.id order by name", attributeDefinitionId);
    }

    @Query
    public List<SceneSelectAttributeOptionDefinition> searchSceneSelectAttributeOptions(SceneSelectAttributeOptionSearchDTO searchDTO){
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(searchDTO.sceneAttributeDefinitionId()), jwt);

        return sceneSelectAttributeOptionDefinitionRepository.search(searchDTO);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition createSceneSelectAttributeOption(SceneSelectAttributeOptionCreateDTO createDTO){
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(createDTO.attributeDefinitionId()), jwt);

        return sceneSelectAttributeOptionDefinitionRepository.create(createDTO);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition deleteSceneSelectAttributeOption(Long id){
        SceneAttributeDefinitionBase sceneAttributeDefinition = sceneSelectAttributeOptionDefinitionRepository.findById(id).sceneAttributeDefinition;
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(sceneAttributeDefinition.id), jwt);

        return sceneSelectAttributeOptionDefinitionRepository.delete(id);
    }

    @Mutation
    public SceneSelectAttributeOptionDefinition updateSceneSelectAttributeOption(SceneSelectAttributeOptionEditDTO editDTO) {
        SceneAttributeDefinitionBase sceneAttributeDefinition = sceneSelectAttributeOptionDefinitionRepository.findById(editDTO.id()).sceneAttributeDefinition;
        userRepository.checkUserAccessRights(sceneAttributeDefinitionRepository.getShotlistByDefinitionId(sceneAttributeDefinition.id), jwt);

        return sceneSelectAttributeOptionDefinitionRepository.update(editDTO);
    }
}
