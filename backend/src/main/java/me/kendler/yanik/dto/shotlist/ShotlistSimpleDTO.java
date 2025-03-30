package me.kendler.yanik.dto.shotlist;

import me.kendler.yanik.dto.user.UserSimpleDTO;

import java.time.LocalDateTime;
import java.util.UUID;

public record ShotlistSimpleDTO(
    UUID id,
    String name,
    UserSimpleDTO owner,
    int sceneCount,
    int shotCount,
    LocalDateTime editedAt
) { }
