package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.CreateSceneDTO;
import me.kendler.yanik.dto.CreateShotlistDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.repositories.ShotlistRepository;
import me.kendler.yanik.repositories.template.TemplateRepository;

@ApplicationScoped
public class SceneRepository implements PanacheRepository<Scene> {
    @Inject
    ShotlistRepository shotlistRepository;

    @Inject
    TemplateRepository templateRepository;

    public Scene create(CreateSceneDTO createDTO){
        Shotlist shotlist = shotlistRepository.findById(createDTO.shotlistId());

        Scene scene = new Scene(shotlist, createDTO.name(), shotlist.);
        persist(shotlist);

        return scene;
    }
}
