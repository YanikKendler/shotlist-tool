package me.kendler.yanik.dto.scene;

import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.shot.Shot;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record SceneDTO (
    UUID id,
    Shotlist shotlist,
    Set<SceneAttributeBaseDTO> attributes,
    Set<Shot> shots,
    int number,
    LocalDateTime createdAt
){ }
