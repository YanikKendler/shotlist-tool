package me.kendler.yanik.repositories.scene;


import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionCreateDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSingleSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneTextAttributeDefinition;
import me.kendler.yanik.repositories.ShotlistRepository;

@ApplicationScoped
public class SceneAttributeDefinitionRepository implements PanacheRepository<SceneAttributeDefinitionBase> {
    @Inject
    ShotlistRepository shotlistRepository;

    public SceneAttributeDefinitionBase create(SceneAttributeDefinitionCreateDTO createDTO){
        if(createDTO == null) {
            throw new IllegalArgumentException("ShotAttributeDefinitionCreateDTO cannot be null");
        }
        if(createDTO.shotlistId() == null) {
            throw new IllegalArgumentException("Shotlist ID cannot be null");
        }
        if(createDTO.type() == null) {
            throw new IllegalArgumentException("ShotAttributeDefinition type cannot be null");
        }

        SceneAttributeDefinitionBase attributeDefinition = null;
        Shotlist shotlist = shotlistRepository.findById(createDTO.shotlistId());

        switch (createDTO.type()) {
            case SceneSingleSelectAttribute -> {
                attributeDefinition = new SceneSingleSelectAttributeDefinition(shotlist);
            }
            case SceneMultiSelectAttribute -> {
                attributeDefinition = new SceneMultiSelectAttributeDefinition(shotlist);
            }
            case SceneTextAttribute -> {
                attributeDefinition = new SceneTextAttributeDefinition(shotlist);
            }
        }

        if(attributeDefinition == null) {
            throw new IllegalArgumentException("Invalid attribute definition type");
        }

        persist(attributeDefinition);

        return attributeDefinition;
    }

    public SceneAttributeDefinitionBase delete(Long id){
        SceneAttributeDefinitionBase attributeDefinition = findById(id);

        if(attributeDefinition != null) {
            delete(attributeDefinition);
            return attributeDefinition;
        }
        return null;
    }
}
