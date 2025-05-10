package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.scene.SceneAttributeEditDTO;
import me.kendler.yanik.dto.shot.*;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotAttributeDefinitionBaseDTO;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.repositories.ShotlistRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeRepository;
import me.kendler.yanik.repositories.shot.ShotAttributeDefinitionRepository;
import me.kendler.yanik.repositories.shot.ShotAttributeRepository;
import me.kendler.yanik.repositories.shot.ShotRepository;
import me.kendler.yanik.repositories.shot.ShotSelectAttributeOptionDefinitionRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@GraphQLApi
public class ShotResource {
    @Inject
    ShotRepository shotRepository;

    @Query
    public List<ShotDTO> getShots(UUID sceneId) {
        return shotRepository.list("scene.id = ?1 order by position", sceneId).stream().map(Shot::toDTO).toList();
    }

    @Mutation
    public ShotDTO createShot(@PathParam("sceneId") UUID sceneId) {
        return shotRepository.create(sceneId).toDTO();
    }

    @Mutation
    public ShotDTO deleteShot(@PathParam("id") UUID id) {
        return shotRepository.delete(id).toDTO();
    }

    @Mutation
    public ShotDTO updateShot(ShotEditDTO editDTO) {
        return shotRepository.update(editDTO).toDTO();
    }

    /*
     * ATTRIBUTE DEFINITIONS
     */

    @Inject
    ShotAttributeDefinitionRepository shotAttributeDefinitionRepository;

    @Query
    public List<ShotAttributeDefinitionBaseDTO> getShotAttributeDefinitions(UUID shotlistId){
        return shotAttributeDefinitionRepository.getAll(shotlistId);
    }

    @Mutation
    public ShotAttributeDefinitionBaseDTO createShotAttributeDefinition(ShotAttributeDefinitionCreateDTO createDTO){
        return shotAttributeDefinitionRepository.create(createDTO).toDTO();
    }

    @Mutation
    public ShotAttributeDefinitionBase deleteShotAttributeDefinition(Long id){
        return shotAttributeDefinitionRepository.delete(id);
    }

    @Mutation
    public ShotAttributeDefinitionBase updateShotAttributeDefinition(ShotAttributeDefinitionEditDTO editDTO) {
        return shotAttributeDefinitionRepository.update(editDTO);
    }

    /*
     * ATTRIBUTES
     */

    @Inject
    ShotAttributeRepository shotAttributeRepository;

    @Mutation
    public ShotAttributeBase updateShotAttribute(ShotAttributeEditDTO editDTO) {
        return shotAttributeRepository.update(editDTO);
    }

    /*
     * SELECT OPTIONS
     */

    @Inject
    ShotSelectAttributeOptionDefinitionRepository shotSelectAttributeOptionDefinitionRepository;

    @Query
    public List<ShotSelectAttributeOptionDefinition> getShotSelectAttributeOptions(Long attributeDefinitionId) {
        return shotSelectAttributeOptionDefinitionRepository.list("shotAttributeDefinition.id = ?1 order by name", attributeDefinitionId);
    }

    @Query
    public List<ShotSelectAttributeOptionDefinition> searchShotSelectAttributeOptions(ShotSelectAttributeOptionSearchDTO searchDTO){
        return shotSelectAttributeOptionDefinitionRepository.search(searchDTO);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition createShotSelectAttributeOption(ShotSelectAttributeOptionCreateDTO createDTO) {
        return shotSelectAttributeOptionDefinitionRepository.create(createDTO);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition deleteShotSelectAttributeOption(Long id){
        return shotSelectAttributeOptionDefinitionRepository.delete(id);
    }

    @Mutation
    public ShotSelectAttributeOptionDefinition updateShotSelectAttributeOption(ShotSelectAttributeOptionEditDTO editDTO) {
        return shotSelectAttributeOptionDefinitionRepository.update(editDTO);
    }
}
