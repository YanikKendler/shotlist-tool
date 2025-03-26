package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.dto.EditShotlistDTO;
import me.kendler.yanik.repositories.ShotlistRepository;

import java.util.UUID;

@Path("/shotlist")
public class ShotlistResource {
    @Inject
    ShotlistRepository shotlistRepository;

    @GET
    public Response getAll() {
        //TODO only show shotlists of the current user
        return Response.ok().entity(shotlistRepository.listAll()).build();
    }

    @POST
    public Response create(CreateShotlistDTO createShotlistDTO) {
        return Response.ok().entity(shotlistRepository.create(createShotlistDTO)).build();
    }

    @PUT
    public Response update(EditShotlistDTO editShotlistDTO) {
        shotlistRepository.update(editShotlistDTO);
        return Response.ok().build();
    }

    @DELETE
    public Response delete(@QueryParam("id") UUID id) {
        shotlistRepository.deleteById(id);
        return Response.ok().build();
    }
}
