package me.kendler.yanik.endpoints;

import io.smallrye.graphql.api.federation.Inaccessible;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.repositories.shot.ShotAttributeRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class ShotAttributeResource {
    @Inject
    ShotAttributeRepository shotAttributeRepository;

    @Query
    public List<ShotAttributeBaseDTO> getShotAttributes(UUID shotId){
        return shotAttributeRepository.list("shot.id", shotId).stream().map(ShotAttributeBase::toDTO).toList();
    }
}
