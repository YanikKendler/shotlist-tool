package me.kendler.yanik.dto.scene;

import java.util.UUID;

public record SceneSimpleDTO (
    UUID id,
    int number,
    String name
){ }
