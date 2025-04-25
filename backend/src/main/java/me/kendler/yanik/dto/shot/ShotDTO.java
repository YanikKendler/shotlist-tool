package me.kendler.yanik.dto.shot;

import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.scene.Scene;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ShotDTO (
    UUID id,
    Scene scene,
    List<ShotAttributeBaseDTO> attributes,
    int position,
    boolean isSubshot,
    LocalDateTime createdAt
){ }
