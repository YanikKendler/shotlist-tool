package me.kendler.yanik.dto.shotlist;

import java.util.UUID;

public record ShotlistCreateDTO(
        UUID userId,
        UUID templateId,
        String name
) { }
