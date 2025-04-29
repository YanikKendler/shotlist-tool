package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.SceneAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionCreateDTO;
import me.kendler.yanik.dto.shot.ShotAttributeDefinitionEditDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotAttributeDefinitionBaseDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotMultiSelectAttributeDefinitionDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotSingleSelectAttributeDefinitionDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.*;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;
import me.kendler.yanik.model.shot.attributes.ShotSingleSelectAttribute;
import me.kendler.yanik.model.shot.attributes.ShotTextAttribute;
import me.kendler.yanik.repositories.ShotlistRepository;

import java.util.*;
import java.util.stream.Collectors;

@ApplicationScoped
@Transactional
public class ShotAttributeDefinitionRepository implements PanacheRepository<ShotAttributeDefinitionBase> {
    @Inject
    ShotlistRepository shotlistRepository;


    public List<ShotAttributeDefinitionBaseDTO> getAll(UUID shotlistId) {
        Set<ShotAttributeDefinitionBase> attributeDefinitions = shotlistRepository.findById(shotlistId).shotAttributeDefinitions;

        List<ShotSelectAttributeOptionDefinition> options = ShotSelectAttributeOptionDefinition.find("shotAttributeDefinition in ?1", attributeDefinitions).list();

        List<ShotAttributeDefinitionBaseDTO> attributeDefinitionDTOs = new ArrayList<>();

        attributeDefinitions.forEach(definition -> {
            switch (definition) {
                case ShotSingleSelectAttributeDefinition singleSelectAttribute -> {
                    attributeDefinitionDTOs.add(new ShotSingleSelectAttributeDefinitionDTO(
                            definition.id,
                            definition.name,
                            definition.position,
                            options.stream().filter(option -> option.shotAttributeDefinition.id.equals(definition.id)).toList()
                    ));
                }
                case ShotMultiSelectAttributeDefinition multiSelectAttribute -> {
                    attributeDefinitionDTOs.add(new ShotMultiSelectAttributeDefinitionDTO(
                            definition.id,
                            definition.name,
                            definition.position,
                            options.stream().filter(option -> option.shotAttributeDefinition.id.equals(definition.id)).toList()
                    ));
                }
                default -> {
                    attributeDefinitionDTOs.add(definition.toDTO());
                }
            }
        });

        return attributeDefinitionDTOs.stream().sorted(Comparator.comparingInt(ShotAttributeDefinitionBaseDTO::getPosition)).collect(Collectors.toList());
    }

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
        if(editDTO.name() != null && !editDTO.name().isEmpty()) {
            attribute.name = editDTO.name();
        }
        if(attribute.position != editDTO.position()){
            Shotlist shotlist = getEntityManager()
                                    .createQuery("select s from Shotlist s where :attribute in s.shotAttributeDefinitions", Shotlist.class)
                                    .setParameter("attribute", attribute)
                                    .getSingleResult();
            shotlist.shotAttributeDefinitions.stream().filter(a -> a.position < attribute.position && a.position >= editDTO.position()).forEach(a -> a.position++);
            shotlist.shotAttributeDefinitions.stream().filter(a -> a.position > attribute.position && a.position <= editDTO.position()).forEach(a -> a.position--);
        }
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
