package me.kendler.yanik.dto.scene;

import me.kendler.yanik.model.scene.SceneAttributeType;

import java.util.UUID;

public record SceneAttributeDefinitionCreateDTO (
    UUID shotlistId,
    SceneAttributeType type
){ }
