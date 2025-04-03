package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import me.kendler.yanik.dto.shotlist.ShotlistDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.repositories.ShotlistRepository;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.Set;

@Path("/test")
public class TestResource {
    @Inject
    ShotlistRepository shotlistRepository;

    @GET
    @Path("/shotAttributeDefinitions")
    public List<Set<ShotAttributeDefinitionBase>> getShots() {
        return shotlistRepository.listAll().stream().map(Shotlist::toDTO).map(ShotlistDTO::shotAttributeDefinitions).toList();
    }

    @GET
    @Path("/sceneAttributeDefinitions")
    public List<Set<SceneAttributeDefinitionBase>> getScenes() {
        return shotlistRepository.listAll().stream().map(Shotlist::toDTO).map(ShotlistDTO::sceneAttributeDefinitions).toList();
    }
}
