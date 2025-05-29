package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.template.Template;

import java.util.UUID;

@ApplicationScoped
public class TemplateRepository implements PanacheRepositoryBase<Template, UUID> {
    public Template delete(UUID id) {
        Template template = findById(id);
        if (template != null) {
            delete(template);
            return template;
        }
        return null;
    }
}
