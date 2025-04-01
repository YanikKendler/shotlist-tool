package me.kendler.yanik.dto.user;

import java.util.UUID;

public record UserSimpleDTO (
    UUID id,
    String username
) { }
