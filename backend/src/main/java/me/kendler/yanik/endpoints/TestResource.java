package me.kendler.yanik.endpoints;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

/**
 * Purely for testing if the service is online
 */
@Path("/test")
public class TestResource {
    @GET
    public String hello() {
        return "Hello, World!";
    }
}
