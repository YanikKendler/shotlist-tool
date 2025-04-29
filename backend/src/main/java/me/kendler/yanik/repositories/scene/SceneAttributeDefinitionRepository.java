package me.kendler.yanik.repositories.scene;


import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionCreateDTO;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.scene.attributeDefinitions.SceneAttributeDefinitionBaseDTO;
import me.kendler.yanik.dto.scene.attributeDefinitions.SceneMultiSelectAttributeDefinitionDTO;
import me.kendler.yanik.dto.scene.attributeDefinitions.SceneSingleSelectAttributeDefinitionDTO;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotAttributeDefinitionBaseDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotSingleSelectAttributeDefinitionDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.*;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.repositories.ShotlistRepository;

import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
public class SceneAttributeDefinitionRepository implements PanacheRepository<SceneAttributeDefinitionBase> {
    @Inject
    ShotlistRepository shotlistRepository;

    public List<SceneAttributeDefinitionBaseDTO> getAll(UUID shotlistId) {
        Set<SceneAttributeDefinitionBase> attributeDefinitions = shotlistRepository.findById(shotlistId).sceneAttributeDefinitions;

        List<SceneSelectAttributeOptionDefinition> options = SceneSelectAttributeOptionDefinition.find("sceneAttributeDefinition in ?1", attributeDefinitions).list();

        List<SceneAttributeDefinitionBaseDTO> attributeDefinitionDTOs = new ArrayList<>();

        attributeDefinitions.forEach(definition -> {
            switch (definition) {
                case SceneSingleSelectAttributeDefinition singleSelectAttribute -> {
                    attributeDefinitionDTOs.add(new SceneSingleSelectAttributeDefinitionDTO(
                            definition.id,
                            definition.name,
                            definition.position,
                            options.stream().filter(option -> option.sceneAttributeDefinition.id.equals(definition.id)).toList()
                    ));
                }
                case SceneMultiSelectAttributeDefinition multiSelectAttribute -> {
                    attributeDefinitionDTOs.add(new SceneMultiSelectAttributeDefinitionDTO(
                            definition.id,
                            definition.name,
                            definition.position,
                            options.stream().filter(option -> option.sceneAttributeDefinition.id.equals(definition.id)).toList()
                    ));
                }
                default -> {
                    attributeDefinitionDTOs.add(definition.toDTO());
                }
            }
        });

        return attributeDefinitionDTOs.stream().sorted(Comparator.comparingInt(SceneAttributeDefinitionBaseDTO::getPosition)).collect(Collectors.toList());
    }

    public SceneAttributeDefinitionBase create(SceneAttributeDefinitionCreateDTO createDTO){
        if(createDTO == null) {
            throw new IllegalArgumentException("SceneAttributeDefinitionCreateDTO cannot be null");
        }
        if(createDTO.shotlistId() == null) {
            throw new IllegalArgumentException("Shotlist ID cannot be null");
        }
        if(createDTO.type() == null) {
            throw new IllegalArgumentException("SceneAttributeDefinition type cannot be null");
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

    public SceneAttributeDefinitionBase update(SceneAttributeDefinitionEditDTO editDTO) {
        SceneAttributeDefinitionBase attribute = findById(editDTO.id());
        if (attribute == null) {
            throw new IllegalArgumentException("Attribute not found");
        }
        if(editDTO.name() != null && !editDTO.name().isEmpty()) {
            attribute.name = editDTO.name();
        }
        if(attribute.position != editDTO.position()){
            Shotlist shotlist = getEntityManager()
                    .createQuery("select s from Shotlist s where :attribute in s.sceneAttributeDefinitions", Shotlist.class)
                    .setParameter("attribute", attribute)
                    .getSingleResult();
            shotlist.sceneAttributeDefinitions.stream().filter(a -> a.position < attribute.position && a.position >= editDTO.position()).forEach(a -> a.position++);
            shotlist.sceneAttributeDefinitions.stream().filter(a -> a.position > attribute.position && a.position <= editDTO.position()).forEach(a -> a.position--);
        }
        return attribute;
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
