package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import me.kendler.yanik.dto.shot.*;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotAttributeDefinitionBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.repositories.UserRepository;
import me.kendler.yanik.repositories.scene.SceneRepository;
import me.kendler.yanik.repositories.shot.ShotAttributeDefinitionRepository;
import me.kendler.yanik.repositories.shot.ShotAttributeRepository;
import me.kendler.yanik.repositories.shot.ShotRepository;
import me.kendler.yanik.repositories.shot.ShotSelectAttributeOptionDefinitionRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class ShotResource {
    @Inject
    JsonWebToken jwt;

    @Inject
    ShotRepository shotRepository;

    @Inject
    SceneRepository sceneRepository;

    @Inject
    UserRepository userRepository;

    private static final Logger LOGGER = Logger.getLogger(ShotResource.class);

    @Query
    public List<ShotDTO> getShots(UUID sceneId) {
        userRepository.checkShotlistAccessRights(sceneRepository.findById(sceneId).shotlist, jwt);

        return shotRepository.findAllForScene(sceneId);
    }

    @Mutation
    public ShotDTO createShot(@PathParam("sceneId") UUID sceneId){
        userRepository.checkShotlistAccessRights(sceneRepository.findById(sceneId).shotlist, jwt);

        return shotRepository.create(sceneId);
    }

    @Mutation
    public ShotDTO deleteShot(@PathParam("id") UUID id) {
        userRepository.checkShotlistAccessRights(shotRepository.findById(id).scene.shotlist, jwt);

        return shotRepository.delete(id);
    }

    @Mutation
    public ShotDTO updateShot(ShotEditDTO editDTO) {
        userRepository.checkShotlistAccessRights(shotRepository.findById(editDTO.id()).scene.shotlist, jwt);

        return shotRepository.update(editDTO);
    }

    /*
     * ATTRIBUTE DEFINITIONS
     */

    @Inject
    ShotAttributeDefinitionRepository shotAttributeDefinitionRepository;

    @Query
    public List<ShotAttributeDefinitionBaseDTO> getShotAttributeDefinitions(UUID shotlistId){
        userRepository.checkShotlistAccessRights(shotlistId, jwt);

        return shotAttributeDefinitionRepository.getAll(shotlistId);
    }

    @Mutation
    public ShotAttributeDefinitionBaseDTO createShotAttributeDefinition(ShotAttributeDefinitionCreateDTO createDTO){
        userRepository.checkShotlistAccessRights(createDTO.shotlistId(), jwt);

        return shotAttributeDefinitionRepository.create(createDTO);
    }

    @Mutation
    public ShotAttributeDefinitionBaseDTO deleteShotAttributeDefinition(Long id){
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(id), jwt);

        return shotAttributeDefinitionRepository.delete(id);
    }

    @Mutation
    public ShotAttributeDefinitionBaseDTO updateShotAttributeDefinition(ShotAttributeDefinitionEditDTO editDTO) {
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(editDTO.id()), jwt);

        return shotAttributeDefinitionRepository.update(editDTO);
    }

    /*
     * ATTRIBUTES
     */

    @Inject
    ShotAttributeRepository shotAttributeRepository;

    @Mutation
    public ShotAttributeBaseDTO updateShotAttribute(ShotAttributeEditDTO editDTO) {
        ShotAttributeDefinitionBase shotAttributeDefinitionBase = shotAttributeRepository.findById(editDTO.id()).definition;
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(shotAttributeDefinitionBase.id), jwt);

        return shotAttributeRepository.update(editDTO);
    }

    /*
     * SELECT OPTIONS
     */

    @Inject
    ShotSelectAttributeOptionDefinitionRepository shotSelectAttributeOptionDefinitionRepository;

    @Query
    public List<ShotSelectAttributeOptionDefinition> getShotSelectAttributeOptions(Long attributeDefinitionId) {
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(attributeDefinitionId), jwt);

        return shotSelectAttributeOptionDefinitionRepository.list("shotAttributeDefinition.id = ?1 order by name", attributeDefinitionId);
    }

    @Query
    public List<ShotSelectAttributeOptionDefinition> searchShotSelectAttributeOptions(ShotSelectAttributeOptionSearchDTO searchDTO){
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(searchDTO.shotAttributeDefinitionId()), jwt);

        return shotSelectAttributeOptionDefinitionRepository.search(searchDTO);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition createShotSelectAttributeOption(ShotSelectAttributeOptionCreateDTO createDTO) {
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(createDTO.attributeDefinitionId()), jwt);

        return shotSelectAttributeOptionDefinitionRepository.create(createDTO);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition deleteShotSelectAttributeOption(Long id){
        ShotAttributeDefinitionBase shotAttributeDefinitionBase = shotSelectAttributeOptionDefinitionRepository.findById(id).shotAttributeDefinition;
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(shotAttributeDefinitionBase.id), jwt);

        return shotSelectAttributeOptionDefinitionRepository.delete(id);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition updateShotSelectAttributeOption(ShotSelectAttributeOptionEditDTO editDTO) {
        ShotAttributeDefinitionBase shotAttributeDefinitionBase = shotSelectAttributeOptionDefinitionRepository.findById(editDTO.id()).shotAttributeDefinition;
        userRepository.checkShotlistAccessRights(shotAttributeDefinitionRepository.getShotlistByDefinitionId(shotAttributeDefinitionBase.id), jwt);

        return shotSelectAttributeOptionDefinitionRepository.update(editDTO);
    }
}
