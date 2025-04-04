package me.kendler.yanik.dto.shot;

import me.kendler.yanik.model.shot.ShotAttributeType;

import java.util.UUID;

public record ShotAttributeDefinitionCreateDTO (
    UUID shotlistId,
    ShotAttributeType type
){ }
