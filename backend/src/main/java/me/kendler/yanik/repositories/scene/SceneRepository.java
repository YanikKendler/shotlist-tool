package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.repositories.ShotlistRepository;

import java.util.UUID;

@ApplicationScoped
@Transactional
public class SceneRepository implements PanacheRepositoryBase<Scene, UUID> {
    @Inject
    ShotlistRepository shotlistRepository;

    public Scene create(UUID shotlistId) {
        Shotlist shotlist = shotlistRepository.findById(shotlistId);

        Scene scene = new Scene(shotlist);
        persist(scene);

        return scene;
    }

    public Scene delete(UUID id) {
        Scene scene = findById(id);
        if (scene != null) {
            delete(scene);
            return scene;
        }
        return null;
    }
}
