package me.kendler.yanik.dto.shotlist;

import me.kendler.yanik.dto.user.UserSimpleDTO;
import me.kendler.yanik.model.scene.Scene;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ShotlistFullDTO(
    UUID id,
    String name,
    UserSimpleDTO owner,
    Set<Scene> scenes,
    List<String> shotAttributeNames,
    LocalDateTime editedAt
) { }
