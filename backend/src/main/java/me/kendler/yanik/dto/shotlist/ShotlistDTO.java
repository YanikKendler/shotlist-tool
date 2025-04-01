package me.kendler.yanik.dto.shotlist;

import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import me.kendler.yanik.dto.scene.SceneDTO;
import me.kendler.yanik.dto.user.UserSimpleDTO;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.template.Template;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ShotlistDTO(
    UUID id,
    User owner,
    Template template,
    Set<SceneDTO> scenes,
    Set<SceneAttributeDefinitionBase> sceneAttributeDefinitions,
    Set<ShotAttributeDefinitionBase> shotAttributeDefinitions,
    String name,
    LocalDateTime createdAt,
    LocalDateTime editedAt
) { }
