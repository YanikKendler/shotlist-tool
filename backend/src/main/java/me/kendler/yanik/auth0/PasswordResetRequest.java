package me.kendler.yanik.auth0;

public record PasswordResetRequest (
        String client_id,
        String email,
        String connection
) { }
