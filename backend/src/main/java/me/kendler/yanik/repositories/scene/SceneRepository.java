package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.dto.scene.SceneEditDTO;
import me.kendler.yanik.dto.shot.ShotEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.repositories.ShotlistRepository;
import me.kendler.yanik.repositories.shot.ShotRepository;

import java.util.UUID;

@ApplicationScoped
public class SceneRepository implements PanacheRepositoryBase<Scene, UUID> {
    @Inject
    ShotlistRepository shotlistRepository;

    @Inject
    ShotRepository shotRepository;

    @Transactional
    public Scene create(UUID shotlistId) {
        Shotlist shotlist = shotlistRepository.findById(shotlistId);
        shotlist.registerEdit();
        Scene scene = new Scene(shotlist);
        persist(scene);

        return scene;
    }

    @Transactional
    public Scene update(SceneEditDTO editDTO) {
        Scene scene = findById(editDTO.id());

        if(scene.position != editDTO.position()){
            scene.shotlist.scenes.stream().filter(s -> s.position < scene.position && s.position >= editDTO.position()).forEach(a -> a.position++);
            scene.shotlist.scenes.stream().filter(s -> s.position > scene.position && s.position <= editDTO.position()).forEach(a -> a.position--);
        }

        scene.position = editDTO.position();

        scene.shotlist.registerEdit();

        return scene;
    }

    @Transactional
    public Scene delete(UUID id) {
        Scene scene = findById(id);
        if (scene != null) {
            scene.shotlist.scenes.stream().filter(s -> s.position > scene.position).forEach(s -> s.position--);

            for (Shot shot : scene.shots) {
                shotRepository.delete(shot);
            }

            scene.shotlist.registerEdit();

            delete(scene);

            return scene;
        }
        return null;
    }
}
