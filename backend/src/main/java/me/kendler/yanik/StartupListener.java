package me.kendler.yanik;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.transaction.Transactional;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.*;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotTextAttributeDefinition;

import org.jboss.logging.Logger;

import java.time.LocalDateTime;

@ApplicationScoped
@io.quarkus.runtime.Startup
public class StartupListener {

    private static final Logger LOGGER = Logger.getLogger(StartupListener.class);

    @Inject
    EntityManager entityManager;

    @ConfigProperty(name = "quarkus.profile", defaultValue = "prod")
    String profile;

    @PostConstruct
    @Transactional
    public void init() {
        if (!"dev".equals(profile)) return;

        LOGGER.info("Initializing demo data...");

        createDemoData();
    }

    @Transactional
    public void createDemoData() {
        User user = new User(LocalDateTime.now().toString(), "yanik", "yanik@mail");
        entityManager.persist(user);

        // Insert a new Shotlist
        Shotlist shotlist = new Shotlist(user, "Demo Shotlist");
        entityManager.persist(shotlist);

        // Define Scene attribute definitions and options
        SceneTextAttributeDefinition sceneDef1 = new SceneTextAttributeDefinition(shotlist, "Props");
        SceneSingleSelectAttributeDefinition sceneDef2 = new SceneSingleSelectAttributeDefinition(shotlist, "Time");
        SceneMultiSelectAttributeDefinition sceneDef3 = new SceneMultiSelectAttributeDefinition(shotlist, "Actors");
        entityManager.persist(sceneDef1);
        entityManager.persist(sceneDef2);
        entityManager.persist(sceneDef3);

        SceneSelectAttributeOptionDefinition sceneOption1 = new SceneSelectAttributeOptionDefinition("Day", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption2 = new SceneSelectAttributeOptionDefinition("Night", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption3 = new SceneSelectAttributeOptionDefinition("Evening", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption4 = new SceneSelectAttributeOptionDefinition("Josh", sceneDef3);
        SceneSelectAttributeOptionDefinition sceneOption5 = new SceneSelectAttributeOptionDefinition("Peter", sceneDef3);
        entityManager.persist(sceneOption1);
        entityManager.persist(sceneOption2);
        entityManager.persist(sceneOption3);
        entityManager.persist(sceneOption4);
        entityManager.persist(sceneOption5);

        // Define Shot attribute definitions and options
        ShotTextAttributeDefinition shotDef1 = new ShotTextAttributeDefinition(shotlist, "Motive");
        ShotSingleSelectAttributeDefinition shotDef2 = new ShotSingleSelectAttributeDefinition(shotlist, "Size");
        ShotMultiSelectAttributeDefinition shotDef3 = new ShotMultiSelectAttributeDefinition(shotlist, "Equipment");
        entityManager.persist(shotDef1);
        entityManager.persist(shotDef2);
        entityManager.persist(shotDef3);

        ShotSelectAttributeOptionDefinition shotOption1 = new ShotSelectAttributeOptionDefinition("Medium Shot", shotDef2);
        ShotSelectAttributeOptionDefinition shotOption2 = new ShotSelectAttributeOptionDefinition("Long Shot", shotDef2);
        ShotSelectAttributeOptionDefinition shotOption3 = new ShotSelectAttributeOptionDefinition("Close Up", shotDef2);
        ShotSelectAttributeOptionDefinition shotOption4 = new ShotSelectAttributeOptionDefinition("Lights", shotDef3);
        ShotSelectAttributeOptionDefinition shotOption5 = new ShotSelectAttributeOptionDefinition("Gimbal", shotDef3);
        entityManager.persist(shotOption1);
        entityManager.persist(shotOption2);
        entityManager.persist(shotOption3);
        entityManager.persist(shotOption4);
        entityManager.persist(shotOption5);

        // -------- Scene 1 --------
        Scene scene1 = new Scene(shotlist);
        entityManager.persist(scene1);

        Shot shot1 = new Shot(scene1);
        entityManager.persist(shot1);

        Shot shot2 = new Shot(scene1);
        entityManager.persist(shot2);

        Shot shot3 = new Shot(scene1);
        entityManager.persist(shot3);

        // -------- Scene 2 --------
        Scene scene2 = new Scene(shotlist);
        entityManager.persist(scene2);

        Shot scene2Shot1 = new Shot(scene2);
        entityManager.persist(scene2Shot1);

        Shot scene2Shot2 = new Shot(scene2);
        entityManager.persist(scene2Shot2);
    }
}