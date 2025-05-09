package me.kendler.yanik.dto.shotlist;

import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.dto.shot.attributeDefinitions.ShotAttributeDefinitionBaseDTO;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.template.Template;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ShotlistDTO(
    UUID id,
    User owner,
    Template template,
    List<SceneDTO> scenes,
    List<SceneAttributeDefinitionBase> sceneAttributeDefinitions,
    List<ShotAttributeDefinitionBaseDTO> shotAttributeDefinitions,
    String name,
    LocalDateTime createdAt,
    LocalDateTime editedAt
) { }
