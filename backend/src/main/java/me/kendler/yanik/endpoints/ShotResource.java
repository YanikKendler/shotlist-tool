package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.shot.ShotDTO;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.repositories.scene.SceneRepository;
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
}
