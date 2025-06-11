package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.template.sceneAttributes.SceneAttributeTemplateCreateDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSingleSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneTextAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotTextAttributeDefinition;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.model.template.sceneAttributes.SceneAttributeTemplateBase;
import me.kendler.yanik.model.template.sceneAttributes.SceneMultiSelectAttributeTemplate;
import me.kendler.yanik.model.template.sceneAttributes.SceneSingleSelectAttributeTemplate;
import me.kendler.yanik.model.template.sceneAttributes.SceneTextAttributeTemplate;
import me.kendler.yanik.model.template.shotAttributes.ShotAttributeTemplateBase;

@Transactional
@ApplicationScoped
public class SceneAttributeTemplateRepository implements PanacheRepository<SceneAttributeTemplateBase> {
    @Inject
    TemplateRepository templateRepository;

    public SceneAttributeTemplateBase create(SceneAttributeTemplateCreateDTO createDTO) {
        if(createDTO == null) {
            throw new IllegalArgumentException("SceneAttributeDefinitionCreateDTO cannot be null");
        }
        if(createDTO.templateId() == null) {
            throw new IllegalArgumentException("Template ID cannot be null");
        }
        if(createDTO.type() == null) {
            throw new IllegalArgumentException("Attribute Type cannot be null");
        }

        SceneAttributeTemplateBase attributeTemplate = null;
        Template template = templateRepository.findById(createDTO.templateId());

        //create different definition type based on selected type in create DTO
        switch (createDTO.type()) {
            case SceneSingleSelectAttribute -> {
                attributeTemplate = new SceneSingleSelectAttributeTemplate(template);
            }
            case SceneMultiSelectAttribute -> {
                attributeTemplate = new SceneMultiSelectAttributeTemplate(template);
            }
            case SceneTextAttribute -> {
                attributeTemplate = new SceneTextAttributeTemplate(template);
            }
        }

        if(attributeTemplate == null) {
            throw new IllegalArgumentException("Invalid attribute type");
        }

        persist(attributeTemplate);

        return attributeTemplate;
    }
}
