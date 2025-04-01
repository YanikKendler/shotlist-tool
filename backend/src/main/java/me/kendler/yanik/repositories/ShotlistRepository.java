package me.kendler.yanik.repositories;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.dto.EditShotlistDTO;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.repositories.template.TemplateRepository;

import java.util.UUID;

@ApplicationScoped
@Transactional
public class ShotlistRepository implements PanacheRepositoryBase<Shotlist, UUID> {
    @Inject
    UserRepository userRepository;

    @Inject
    TemplateRepository templateRepository;

    public Shotlist create(CreateShotlistDTO createDTO){
        User user = userRepository.findById(createDTO.userId());

        Shotlist shotlist;

        if(createDTO.templateId() == null) { // no template was provided, creating a blank shotlist
            shotlist = new Shotlist(user, createDTO.name());
        }
        else {
            Template template = templateRepository.findById(createDTO.templateId());
            shotlist = new Shotlist(user, template, createDTO.name());
        }

        persist(shotlist);

        return shotlist;
    }

    public Shotlist update(EditShotlistDTO editDTO){
        Shotlist shotlist = findById(editDTO.id());
        shotlist.name = editDTO.name();
        persist(shotlist);
        return shotlist;
    }

    public Shotlist delete(UUID id){
        Shotlist shotlist = findById(id);
        if(shotlist != null) {
            delete(shotlist);
            return shotlist;
        }
        return null;
    }
}
