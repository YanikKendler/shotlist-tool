package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.shotlist.ShotlistCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistEditDTO;
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

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") UUID id) {
        return Response.ok().entity(shotlistRepository.findById(id)).build();
    }

    @POST
    public Response create(ShotlistCreateDTO shotlistCreateDTO) {
        return Response.ok().entity(shotlistRepository.create(shotlistCreateDTO)).build();
    }

    @PUT
    public Response update(ShotlistEditDTO shotlistEditDTO) {
        shotlistRepository.update(shotlistEditDTO);
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        shotlistRepository.deleteById(id);
        return Response.ok().build();
    }
}
