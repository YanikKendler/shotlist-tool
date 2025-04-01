package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.shotlist.ShotlistCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.repositories.ShotlistRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class ShotlistResource {
    @Inject
    ShotlistRepository shotlistRepository;

    @Query
    public List<Shotlist> getShotlists() {
        //TODO only show shotlists of the current user
        return shotlistRepository.listAll();
    }
    @Mutation
    public Shotlist createShotlist(ShotlistCreateDTO shotlistCreateDTODTO) {
        return shotlistRepository.create(shotlistCreateDTODTO);
    }

    @Mutation
    public Shotlist updateShotlist(ShotlistEditDTO shotlistEditDTO) {
        return shotlistRepository.update(shotlistEditDTO);
    }

    @Mutation
    public Shotlist deleteShotlist(UUID id) {
        return shotlistRepository.delete(id);
    }
}
