package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.dto.EditShotlistDTO;
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
    public Shotlist createShotlist(CreateShotlistDTO createShotlistDTO) {
        return shotlistRepository.create(createShotlistDTO);
    }

    @Mutation
    public Shotlist updateShotlist(EditShotlistDTO editShotlistDTO) {
        return shotlistRepository.update(editShotlistDTO);
    }

    @Mutation
    public Shotlist deleteShotlist(UUID id) {
        return shotlistRepository.delete(id);
    }
}
