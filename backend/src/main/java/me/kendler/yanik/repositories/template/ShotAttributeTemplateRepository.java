package me.kendler.yanik.repositories.template;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.template.sceneAttributes.SceneAttributeTemplateCreateDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateCreateDTO;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.model.template.sceneAttributes.SceneAttributeTemplateBase;
import me.kendler.yanik.model.template.sceneAttributes.SceneMultiSelectAttributeTemplate;
import me.kendler.yanik.model.template.sceneAttributes.SceneSingleSelectAttributeTemplate;
import me.kendler.yanik.model.template.sceneAttributes.SceneTextAttributeTemplate;
import me.kendler.yanik.model.template.shotAttributes.ShotAttributeTemplateBase;
import me.kendler.yanik.model.template.shotAttributes.ShotMultiSelectAttributeTemplate;
import me.kendler.yanik.model.template.shotAttributes.ShotSingleSelectAttributeTemplate;
import me.kendler.yanik.model.template.shotAttributes.ShotTextAttributeTemplate;
import org.jboss.logging.Logger;

@Transactional
@ApplicationScoped
public class ShotAttributeTemplateRepository implements PanacheRepository<ShotAttributeTemplateBase> {
    @Inject
    TemplateRepository templateRepository;

    private Logger LOGGER = Logger.getLogger(ShotAttributeTemplateRepository.class);

    public ShotAttributeTemplateBase create(ShotAttributeTemplateCreateDTO createDTO) {
        if(createDTO == null) {
            throw new IllegalArgumentException("ShotAttributeDefinitionCreateDTO cannot be null");
        }
        if(createDTO.templateId() == null) {
            throw new IllegalArgumentException("Template ID cannot be null");
        }
        if(createDTO.type() == null) {
            throw new IllegalArgumentException("Attribute Type cannot be null");
        }

        ShotAttributeTemplateBase attributeTemplate = null;
        Template template = templateRepository.findById(createDTO.templateId());

        //create different definition type based on selected type in create DTO
        switch (createDTO.type()) {
            case ShotSingleSelectAttribute -> {
                attributeTemplate = new ShotSingleSelectAttributeTemplate(template);
            }
            case ShotMultiSelectAttribute -> {
                attributeTemplate = new ShotMultiSelectAttributeTemplate(template);
            }
            case ShotTextAttribute -> {
                attributeTemplate = new ShotTextAttributeTemplate(template);
            }
        }

        if(attributeTemplate == null) {
            throw new IllegalArgumentException("Invalid attribute type");
        }

        persist(attributeTemplate);

        return attributeTemplate;
    }
}
