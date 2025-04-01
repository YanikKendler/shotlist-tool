package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.CreateShotlistDTO;
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
    public List<Scene> getScenes(UUID shotlistId) {
        return sceneRepository.list("shotlist.id", shotlistId);
    }

    @Mutation
    public Scene createScene(UUID shotlistId) {
        return sceneRepository.create(shotlistId);
    }

    @Mutation
    public Scene deleteScene(UUID id) {
        return sceneRepository.delete(id);
    }

}
