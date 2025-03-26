package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.repositories.scene.SceneRepository;
import me.kendler.yanik.repositories.shot.ShotRepository;

import java.util.UUID;

@Path("/shotlist/{shotlistId}/scene/{sceneId}/shot")
public class ShotResource {
    @Inject
    ShotRepository shotRepository;

    @GET
    public Response getAll(@PathParam("sceneId") UUID sceneId) {
        return Response.ok().entity(shotRepository.list("scene.id", sceneId)).build();
    }

    @POST
    public Response create(@PathParam("sceneId") UUID sceneId) {
        return Response.ok().entity(shotRepository.create(sceneId)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        shotRepository.deleteById(id);
        return Response.ok().build();
    }
}
