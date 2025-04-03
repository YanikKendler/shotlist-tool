package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.scene.attributeDefinitions.ShotAttributeDefinitionCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistDTO;
import me.kendler.yanik.dto.shotlist.ShotlistEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.repositories.ShotlistRepository;
import me.kendler.yanik.repositories.scene.SceneAttributeDefinitionRepository;
import me.kendler.yanik.repositories.shot.ShotAttributeDefinitionRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

//TODO i dont know why when getting it only returns a single shot defnition instead of all three

@GraphQLApi
public class ShotlistResource {
    @Inject
    ShotlistRepository shotlistRepository;

    @Query
    public List<ShotlistDTO> getShotlists() {
        //TODO only show shotlists of the current user
        return shotlistRepository.listAll().stream().map(Shotlist::toDTO).toList();
    }

    @Mutation
    public ShotlistDTO createShotlist(ShotlistCreateDTO createDTO) {
        return shotlistRepository.create(createDTO).toDTO();
    }

    @Mutation
    public ShotlistDTO updateShotlist(ShotlistEditDTO editDTO) {
        return shotlistRepository.update(editDTO).toDTO();
    }

    @Mutation
    public ShotlistDTO deleteShotlist(UUID id) {
        return shotlistRepository.delete(id).toDTO();
    }
}
