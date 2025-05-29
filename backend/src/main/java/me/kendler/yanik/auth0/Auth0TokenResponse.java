package me.kendler.yanik.auth0;

public record Auth0TokenResponse(
    String access_token,
    String token_type
) { }
