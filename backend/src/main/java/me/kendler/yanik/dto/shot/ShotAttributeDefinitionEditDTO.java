package me.kendler.yanik.dto.shot;

import io.smallrye.graphql.api.Nullable;

public record ShotAttributeDefinitionEditDTO(
    Long id,
    @Nullable String name,
    @Nullable Integer position
) { }
