package me.kendler.yanik.endpoints;

import jakarta.inject.Inject;
import me.kendler.yanik.dto.template.TemplateCreateDTO;
import me.kendler.yanik.dto.template.TemplateDTO;
import me.kendler.yanik.dto.template.TemplateEditDTO;
import me.kendler.yanik.dto.template.sceneAttributes.SceneAttributeTemplateBaseDTO;
import me.kendler.yanik.dto.template.sceneAttributes.SceneAttributeTemplateCreateDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateBaseDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateCreateDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateEditDTO;
import me.kendler.yanik.model.template.Template;
import me.kendler.yanik.repositories.UserRepository;
import me.kendler.yanik.repositories.template.SceneAttributeTemplateRepository;
import me.kendler.yanik.repositories.template.ShotAttributeTemplateRepository;
import me.kendler.yanik.repositories.template.TemplateRepository;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

@GraphQLApi
public class TemplateResource {
    @Inject
    JsonWebToken jwt;

    @Inject
    TemplateRepository templateRepository;

    @Inject
    UserRepository userRepository;

    @Query
    public List<TemplateDTO> getTemplates() {
        return userRepository.findOrCreateByJWT(jwt).templates.stream().map(Template::toDTO).toList();
    }

    @Query
    public TemplateDTO getTemplate(UUID id) {
        Template template = templateRepository.findById(id);
        if (template == null) {
            return null;
        }
        userRepository.checkTemplateAccessRights(template, jwt);
        return template.toDTO();
    }

    @Mutation
    public TemplateDTO createTemplate(TemplateCreateDTO createDTO) {
        return templateRepository.create(createDTO, jwt).toDTO();
    }

    @Mutation
    public TemplateDTO updateTemplate(TemplateEditDTO editDTO) {
        userRepository.checkTemplateAccessRights(templateRepository.findById(editDTO.id()), jwt);
        return templateRepository.update(editDTO).toDTO();
    }

    @Mutation
    public TemplateDTO deleteTemplate(UUID id) {
        userRepository.checkTemplateAccessRights(templateRepository.findById(id), jwt);
        return templateRepository.delete(id).toDTO();
    }

    /*
     * SHOT ATTRIBUTE DEFINITIONS
     */

    @Inject
    ShotAttributeTemplateRepository shotAttributeTemplateRepository;

    @Mutation
    public ShotAttributeTemplateBaseDTO createShotAttributeTemplate(ShotAttributeTemplateCreateDTO createDTO) {
        userRepository.checkTemplateAccessRights(templateRepository.findById(createDTO.templateId()), jwt);
        return shotAttributeTemplateRepository.create(createDTO).toDTO();
    }

    /*
     * SCENE ATTRIBUTE DEFINITIONS
     */

    @Inject
    SceneAttributeTemplateRepository sceneAttributeTemplateRepository;

    @Mutation
    public SceneAttributeTemplateBaseDTO createSceneAttributeTemplate(SceneAttributeTemplateCreateDTO createDTO) {
        userRepository.checkTemplateAccessRights(templateRepository.findById(createDTO.templateId()), jwt);
        return sceneAttributeTemplateRepository.create(createDTO).toDTO();
    }
}
