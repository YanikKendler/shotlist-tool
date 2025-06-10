package me.kendler.yanik.dto.template;

import me.kendler.yanik.dto.template.sceneAttributes.SceneAttributeTemplateBaseDTO;
import me.kendler.yanik.dto.template.shotAttributes.ShotAttributeTemplateBaseDTO;
import me.kendler.yanik.model.User;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record TemplateDTO (
        UUID id,
        User owner,
        String name,
        List<SceneAttributeTemplateBaseDTO> sceneAttributes,
        List<ShotAttributeTemplateBaseDTO> shotAttributes,
        ZonedDateTime createdAt,
        int sceneAttributeCount,
        int shotAttributeCount
){ }
