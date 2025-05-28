package me.kendler.yanik.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.StartupListener;
import me.kendler.yanik.UnauthorizedAccessException;
import me.kendler.yanik.dto.user.UserEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.User;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import java.util.Optional;
import java.util.UUID;

@Transactional
@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, UUID> {
    @Inject
    ShotlistRepository shotlistRepository;

    private static final Logger LOGGER = Logger.getLogger(UserRepository.class);

    public User findOrCreateByJWT(JsonWebToken jwt) {
        String auth0Sub = jwt.getClaim("sub");
        if (auth0Sub == null) {
            LOGGER.errorf("Tried to find user by JWT %s, but JWT does not contain 'sub' claim", jwt.toString());
            throw new IllegalArgumentException("JWT does not contain 'sub' claim");
        }
        Optional<User> user = find("auth0Sub", auth0Sub).singleResultOptional();

        if (user.isPresent()) {
            return user.get();
        } else {
            User newUser = new User(auth0Sub, jwt.getClaim("name"), jwt.getClaim("email"));
            persist(newUser);
            LOGGER.infof("Created new user: %s", newUser.toString());
            return newUser;
        }
    }

    public User update(UserEditDTO editDTO, JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        if (editDTO.name() != null) {
            user.name = editDTO.name();
        }
        persist(user);
        LOGGER.infof("Updated user: %s", user.toString());
        return user;
    }

    public boolean userCanAccessShotlist(Shotlist shotlist, JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        return userCanAccessShotlist(shotlist, user);
    }

    public boolean userCanAccessShotlist(Shotlist shotlist, User user) {
        // TODO Add collaborator support
        if (shotlist != null && user.equals(shotlist.owner)) {
            return true;
        }
        return false;
    }

    public void checkUserAccessRights(Shotlist shotlist, JsonWebToken jwt) {
        if (!userCanAccessShotlist(shotlist, jwt)) {
            throw new UnauthorizedAccessException("You are not allowed to access this shotlist");
        }
    }

    public void checkUserAccessRights(UUID shotlistId, JsonWebToken jwt) {
        if (!userCanAccessShotlist(shotlistRepository.findById(shotlistId), jwt)) {
            throw new UnauthorizedAccessException("You are not allowed to access this shotlist");
        }
    }
}
