package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.shotlist.ShotlistCreateDTO;
import me.kendler.yanik.dto.shotlist.ShotlistDTO;
import me.kendler.yanik.dto.shotlist.ShotlistEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.repositories.ShotlistRepository;
import me.kendler.yanik.repositories.UserRepository;
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

    @Inject
    UserRepository userRepository;

    @Query
    public List<ShotlistDTO> getShotlists() {
        return shotlistRepository.findAllForUser(jwt);
    }

    @Query
    public ShotlistDTO getShotlist(UUID id) {
        userRepository.checkShotlistAccessRights(shotlistRepository.findById(id), jwt);

        return shotlistRepository.findAsDTO(id);
    }

    @Mutation
    public ShotlistDTO createShotlist(ShotlistCreateDTO createDTO) {
        return shotlistRepository.create(createDTO, jwt).toDTO();
    }

    @Mutation
    public ShotlistDTO updateShotlist(ShotlistEditDTO editDTO) {
        userRepository.checkShotlistAccessRights(shotlistRepository.findById(editDTO.id()), jwt);
        return shotlistRepository.update(editDTO).toDTO();
    }

    @Mutation
    public ShotlistDTO deleteShotlist(UUID id) {
        userRepository.checkShotlistAccessRights(shotlistRepository.findById(id), jwt);
        return shotlistRepository.delete(id).toDTO();
    }
}
