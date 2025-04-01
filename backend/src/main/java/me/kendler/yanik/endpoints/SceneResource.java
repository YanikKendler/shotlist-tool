package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.model.scene.Scene;
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
}
