package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import me.kendler.yanik.model.template.Template;

@ApplicationScoped
public class TemplateRepository implements PanacheRepositoryBase<Template, String> {
}
