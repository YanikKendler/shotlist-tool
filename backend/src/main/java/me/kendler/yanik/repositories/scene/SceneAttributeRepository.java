package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;

@ApplicationScoped
public class SceneAttributeRepository implements PanacheRepository<SceneAttributeBase> {
}
