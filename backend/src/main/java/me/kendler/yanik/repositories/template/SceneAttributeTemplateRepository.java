package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.template.sceneAttributes.SceneAttributeTemplateBase;

@ApplicationScoped
public class SceneAttributeTemplateRepository implements PanacheRepository<SceneAttributeTemplateBase> {
}
