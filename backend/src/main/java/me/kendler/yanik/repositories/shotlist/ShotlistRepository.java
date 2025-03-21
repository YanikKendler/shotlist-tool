package me.kendler.yanik.repositories.shotlist;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.shotlist.Shotlist;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.repositories.UserRepository;
import me.kendler.yanik.repositories.template.TemplateRepository;

@ApplicationScoped
public class ShotlistRepository implements PanacheRepositoryBase<Shotlist, String> {
    @Inject
    UserRepository userRepository;

    @Inject
    TemplateRepository templateRepository;

    public Shotlist create(CreateShotlistDTO createDTO){
        User user = userRepository.findById(createDTO.userId());
        Template template = templateRepository.findById(createDTO.templateId());

        Shotlist shotlist = new Shotlist(user, template, createDTO.name());
        persist(shotlist);

        return shotlist;
    }
}
