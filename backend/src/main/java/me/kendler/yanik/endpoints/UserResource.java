package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.user.UserEditDTO;
import me.kendler.yanik.model.User;
import me.kendler.yanik.repositories.UserRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;

@GraphQLApi
public class UserResource {
    @Inject
    JsonWebToken jwt;

    @Inject
    UserRepository userRepository;

    @Query
    public User getCurrentUser() {
        return userRepository.findOrCreateByJWT(jwt);
    }

    @Mutation
    public User updateUser(UserEditDTO editDTO) {
        return userRepository.update(editDTO, jwt);
    }
}
