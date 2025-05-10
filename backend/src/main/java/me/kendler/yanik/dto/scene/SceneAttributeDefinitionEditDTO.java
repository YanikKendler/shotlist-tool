package me.kendler.yanik.dto.scene;

import io.smallrye.graphql.api.Nullable;

public record SceneAttributeDefinitionEditDTO (
    Long id,
    @Nullable String name,
    @Nullable Integer position
) { }
