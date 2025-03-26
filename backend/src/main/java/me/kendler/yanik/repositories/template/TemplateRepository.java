package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.template.Template;

import java.util.UUID;

@ApplicationScoped
public class TemplateRepository implements PanacheRepositoryBase<Template, UUID> {
}
