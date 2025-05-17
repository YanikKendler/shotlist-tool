package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.shotlist.ShotlistCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistDTO;
import me.kendler.yanik.dto.shotlist.ShotlistEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.repositories.ShotlistRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class ShotlistResource {
    @Inject
    JsonWebToken jwt;

    @Inject
    ShotlistRepository shotlistRepository;

    @Query
    public List<ShotlistDTO> getShotlists() {
        System.out.println("token: " + jwt);
        System.out.println("user: " + jwt.getClaim("sub"));
        //TODO only show shotlists of the current user
        return shotlistRepository.listAll().stream().map(Shotlist::toDTO).toList();
    }

    @Query
    public ShotlistDTO getShotlist(UUID id) {

        Shotlist shotlist = shotlistRepository.findById(id);
        if (shotlist == null) {
            return null;
        }
        return shotlist.toDTO();
    }

    @Mutation
    public ShotlistDTO createShotlist(ShotlistCreateDTO createDTO) {
        return shotlistRepository.create(createDTO).toDTO();
    }

    @Mutation
    public ShotlistDTO updateShotlist(ShotlistEditDTO editDTO) {
        return shotlistRepository.update(editDTO).toDTO();
    }

    @Mutation
    public ShotlistDTO deleteShotlist(UUID id) {
        return shotlistRepository.delete(id).toDTO();
    }
}
