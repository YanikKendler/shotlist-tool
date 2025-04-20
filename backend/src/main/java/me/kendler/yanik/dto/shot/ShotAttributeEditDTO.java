package me.kendler.yanik.dto.shot;

import io.smallrye.graphql.api.Nullable;

import java.util.Set;

public record ShotAttributeEditDTO (
    Long id,
    Set<Long> multiSelectValue,
    Long singleSelectValue,
    String textValue
){ }
