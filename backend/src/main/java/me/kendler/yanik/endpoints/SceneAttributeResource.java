package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.repositories.scene.SceneAttributeRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Id;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class SceneAttributeResource {
    @Inject
    SceneAttributeRepository sceneAttributeRepository;

    @Query
    public List<SceneAttributeBaseDTO> getSceneAttributes(UUID sceneId){
        return sceneAttributeRepository.list("scene.id", sceneId).stream().map(SceneAttributeBase::toDTO).toList();
    }
}
