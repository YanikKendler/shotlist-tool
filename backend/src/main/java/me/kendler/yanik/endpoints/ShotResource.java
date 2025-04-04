package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionCreateDTO;
import me.kendler.yanik.dto.shot.ShotDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.repositories.shot.ShotAttributeDefinitionRepository;
import me.kendler.yanik.repositories.shot.ShotRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class ShotResource {
    @Inject
    ShotRepository shotRepository;

    @Query
    public List<ShotDTO> getShots(UUID sceneId) {
        return shotRepository.list("scene.id", sceneId).stream().map(Shot::toDTO).toList();
    }

    @Mutation
    public ShotDTO createShot(@PathParam("sceneId") UUID sceneId) {
        return shotRepository.create(sceneId).toDTO();
    }

    @Mutation
    public ShotDTO deleteShot(@PathParam("id") UUID id) {
        return shotRepository.delete(id).toDTO();
    }

    @Inject
    ShotAttributeDefinitionRepository shotAttributeDefinitionRepository;

    @Query
    public List<ShotAttributeDefinitionBase> getShotAttributeDefinitions(UUID shotlistId){
        return shotAttributeDefinitionRepository.list("shotlist.id", shotlistId);
    }

    @Mutation
    public ShotAttributeDefinitionBase createShotAttributeDefinition(ShotAttributeDefinitionCreateDTO createDTO){
        return  shotAttributeDefinitionRepository.create(createDTO);
    }

    @Mutation
    public ShotAttributeDefinitionBase deleteShotAttributeDefinition(Long id){
        return shotAttributeDefinitionRepository.delete(id);
    }
}
