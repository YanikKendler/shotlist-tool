package me.kendler.yanik.repositories.shotlist.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.shotlist.scene.Scene;

@ApplicationScoped
public class SceneRepository implements PanacheRepository<Scene> {
}
