package me.kendler.yanik.auth0;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(baseUri = "https://dev-pvlm4i5qpteni14h.us.auth0.com/")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface Auth0ManagementClient {

    @DELETE
    @Path("/api/v2/users{id}")
    void deleteUserById(
            @HeaderParam("Authorization") String authorization,
            @PathParam("id") String userId
    );

    /*@POST
    @Path("/dbconnections/change_password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String triggerPasswordReset(
            @FormParam("client_id") String clientId,
            @FormParam("email") String email,
            @FormParam("connection") String connection
    );*/

    @POST
    @Path("/dbconnections/change_password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    String triggerPasswordReset(PasswordResetRequest request);
}