package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionCreateDTO;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionEditDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotTextAttributeDefinition;
import me.kendler.yanik.repositories.ShotlistRepository;

@ApplicationScoped
@Transactional
public class ShotAttributeDefinitionRepository implements PanacheRepository<ShotAttributeDefinitionBase> {
    @Inject
    ShotlistRepository shotlistRepository;

    public ShotAttributeDefinitionBase create(ShotAttributeDefinitionCreateDTO createDTO) {
        if(createDTO == null) {
            throw new IllegalArgumentException("ShotAttributeDefinitionCreateDTO cannot be null");
        }
        if(createDTO.shotlistId() == null) {
            throw new IllegalArgumentException("Shotlist ID cannot be null");
        }
        if(createDTO.type() == null) {
            throw new IllegalArgumentException("ShotAttributeDefinition type cannot be null");
        }

        ShotAttributeDefinitionBase attributeDefinition = null;
        Shotlist shotlist = shotlistRepository.findById(createDTO.shotlistId());

        switch (createDTO.type()) {
            case ShotSingleSelectAttribute -> {
                attributeDefinition = new ShotSingleSelectAttributeDefinition(shotlist);
            }
            case ShotMultiSelectAttribute -> {
                attributeDefinition = new ShotMultiSelectAttributeDefinition(shotlist);
            }
            case ShotTextAttribute -> {
                attributeDefinition = new ShotTextAttributeDefinition(shotlist);
            }
        }

        if(attributeDefinition == null) {
            throw new IllegalArgumentException("Invalid attribute definition type");
        }

        persist(attributeDefinition);

        return attributeDefinition;
    }

    public ShotAttributeDefinitionBase update(ShotAttributeDefinitionEditDTO editDTO) {
        ShotAttributeDefinitionBase attribute = findById(editDTO.id());
        if (attribute == null) {
            throw new IllegalArgumentException("Attribute not found");
        }
        attribute.update(editDTO);
        return attribute;
    }

    public ShotAttributeDefinitionBase delete(Long id){
        ShotAttributeDefinitionBase attributeDefinition = findById(id);

        if(attributeDefinition != null) {
            delete(attributeDefinition);
            return attributeDefinition;
        }
        return null;
    }
}
