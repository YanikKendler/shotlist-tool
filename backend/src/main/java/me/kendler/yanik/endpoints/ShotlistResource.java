package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.repositories.ShotlistRepository;

@Path("/shotlist")
public class ShotlistResource {
    @Inject
    ShotlistRepository shotlistRepository;

    @GET
    public Response getAll(@QueryParam("userId") String userId) {
        return Response.ok().entity(shotlistRepository.listAll()).build();
    }

    @PUT
    public Response create(CreateShotlistDTO createShotlistDTO) {
        return Response.ok().entity(shotlistRepository.create(createShotlistDTO)).build();
    }
}
