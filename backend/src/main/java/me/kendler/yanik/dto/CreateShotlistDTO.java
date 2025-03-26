package me.kendler.yanik.dto;

import java.util.UUID;

public record CreateShotlistDTO(
        UUID userId,
        UUID templateId,
        String name
) { }
