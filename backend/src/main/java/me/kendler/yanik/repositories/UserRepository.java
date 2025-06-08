package me.kendler.yanik.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.UnauthorizedAccessException;
import me.kendler.yanik.auth0.Auth0Service;
import me.kendler.yanik.dto.user.UserEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.repositories.template.TemplateRepository;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, UUID> {
    @Inject
    ShotlistRepository shotlistRepository;

    @Inject
    TemplateRepository templateRepository;

    @Inject
    Auth0Service auth0Service;

    private static final Logger LOGGER = Logger.getLogger(UserRepository.class);

    @Transactional
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

    @Transactional
    public User update(UserEditDTO editDTO, JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        if (editDTO.name() != null) {
            user.name = editDTO.name();
        }
        persist(user);
        LOGGER.infof("Updated user: %s", user.toString());
        return user;
    }

    @Transactional
    public User delete(JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        LOGGER.infof("Deleting user: %s", user.toString());
        auth0Service.deleteUser(user.auth0Sub);
        for (Shotlist shotlist : user.shotlists) {
            shotlistRepository.delete(shotlist.id);
        }
        for (Template template : user.templates) {
            templateRepository.delete(template.id);
        }
        delete(user);
        return user;
    }

    public String triggerPasswordReset(JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        return auth0Service.triggerPasswordReset(user.email);
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

    public void checkShotlistAccessRights(Shotlist shotlist, JsonWebToken jwt) {
        LOGGER.info("In CheckUserAccessRights");
        if (!userCanAccessShotlist(shotlist, jwt)) {
            throw new UnauthorizedAccessException("You are not allowed to access this shotlist");
        }
    }

    public void checkShotlistAccessRights(UUID shotlistId, JsonWebToken jwt) {
        checkShotlistAccessRights(shotlistRepository.findById(shotlistId), jwt);
    }

    public boolean userCanAccessTemplate(Template template, JsonWebToken jwt) {
        User user = findOrCreateByJWT(jwt);
        return userCanAccessTemplate(template, user);
    }

    public boolean userCanAccessTemplate(Template template, User user) {
        // TODO Add collaborator support
        if (template != null && user.equals(template.owner)) {
            return true;
        }
        return false;
    }

    public void checkTemplateAccessRights(Template template, JsonWebToken jwt) {
        LOGGER.info("In CheckUserAccessRights");
        if (!userCanAccessTemplate(template, jwt)) {
            throw new UnauthorizedAccessException("You are not allowed to access this template");
        }
    }

    public void checkTemplateAccessRights(UUID templateId, JsonWebToken jwt) {
        checkTemplateAccessRights(templateRepository.findById(templateId), jwt);
    }
}
