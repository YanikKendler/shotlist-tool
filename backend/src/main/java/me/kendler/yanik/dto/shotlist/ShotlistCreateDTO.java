package me.kendler.yanik.dto.shotlist;

import io.smallrye.graphql.api.Nullable;

import java.util.UUID;

public record ShotlistCreateDTO(
        @Nullable String userId,
        @Nullable UUID templateId,
        String name
) { }
