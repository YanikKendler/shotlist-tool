package me.kendler.yanik.services;

import org.eclipse.microprofile.config.inject.ConfigProperty;

public class Auth0Service {
    @ConfigProperty(name = "auth0.client-id")
    String clientId;

    @ConfigProperty(name = "auth0.client-secret")
    String clientSecret;

    @ConfigProperty(name = "auth0.audience")
    String audience;

    public void deleteUser(String userId) {
        String token = getManagementToken();
        //auth0Client.deleteUserById("Bearer " + token, userId);
    }

    private String getManagementToken() {
        /*Auth0TokenRequest request = new Auth0TokenRequest();
        request.client_id = clientId;
        request.client_secret = clientSecret;
        request.audience = audience;

        Auth0TokenResponse response = auth0TokenClient.getToken(request);
        return response.access_token;*/
        return "token";
    }
}
