package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.shot.ShotEditDTO;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.repositories.UserRepository;
import me.kendler.yanik.repositories.scene.SceneRepository;
import org.jboss.logging.Logger;

import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
@Transactional
public class ShotRepository implements PanacheRepositoryBase<Shot, UUID> {
    @Inject
    SceneRepository sceneRepository;

    private static final Logger LOGGER = Logger.getLogger(ShotRepository.class);

    public Shot create(UUID sceneId) {
        LOGGER.infof("started creating shot");
        Scene scene = sceneRepository.findById(sceneId);
        Shot shot = new Shot(scene);
        scene.shotlist.registerEdit();
        persist(shot);
        LOGGER.infof("finished creating new shot: %s", shot.toString());
        return shot;
    }

    public Shot update(ShotEditDTO editDTO) {
        Shot shot = findById(editDTO.id());

        if(shot.position != editDTO.position()){
            //shot was moved back
            //0 1 2 3 New 5 6 Old
            shot.scene.shots.stream()
                    .filter(s -> s.position < shot.position && s.position >= editDTO.position())
                    .forEach(a -> a.position++);
            //shot was moved forward
            //0 1 2 3 Old 5 6 New
            shot.scene.shots.stream()
                    .filter(s -> s.position > shot.position && s.position <= editDTO.position())
                    .forEach(a -> a.position--);
        }

        shot.position = editDTO.position();

        shot.scene.shotlist.registerEdit();

        return shot;
    }

    public Shot delete(UUID id) {
        Shot shot = findById(id);
        if (shot != null) {
            shot.scene.shotlist.registerEdit();
            delete(shot);
            return shot;
        }
        return null;
    }
}