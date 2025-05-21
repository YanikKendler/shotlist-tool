package me.kendler.yanik.endpoints;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;

@Path("/test")
public class TestResource {
    @GET
    public String hello() {
        return "Hello, World!";
    }
}
