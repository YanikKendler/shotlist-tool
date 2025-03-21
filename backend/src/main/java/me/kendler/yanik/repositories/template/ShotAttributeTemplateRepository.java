package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.template.shotAttributes.ShotAttributeTemplateBase;

@ApplicationScoped
public class ShotAttributeTemplateRepository implements PanacheRepository<ShotAttributeTemplateBase> {
}
