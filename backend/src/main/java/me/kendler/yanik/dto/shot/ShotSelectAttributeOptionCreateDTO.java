package me.kendler.yanik.dto.shot;

import io.smallrye.graphql.api.Nullable;

public record ShotSelectAttributeOptionCreateDTO(
    Long attributeDefinitionId,
    @Nullable String name
) { }
