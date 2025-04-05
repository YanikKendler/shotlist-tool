package me.kendler.yanik;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.User;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.scene.attributeDefinitions.*;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneMultiSelectAttribute;
import me.kendler.yanik.model.scene.attributes.SceneSingleSelectAttribute;
import me.kendler.yanik.model.scene.attributes.SceneTextAttribute;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotTextAttributeDefinition;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;
import me.kendler.yanik.model.shot.attributes.ShotSingleSelectAttribute;
import me.kendler.yanik.model.shot.attributes.ShotTextAttribute;

import java.util.Set;

@ApplicationScoped
@io.quarkus.runtime.Startup
public class StartupListener {

    @Inject
    EntityManager entityManager;

    @PostConstruct
    @Transactional
    public void init() {
        System.out.println("Initializing demo data...");

        createDemoData();
    }

    @Transactional
    public void createDemoData(){
        // Insert a new User (assuming a User entity exists)
        User user = new User("yanik", "yanik@mail");
        entityManager.persist(user);

        // Insert a new Shotlist
        Shotlist shotlist = new Shotlist(user, "Demo Shotlist");
        entityManager.persist(shotlist);

        // Insert a new Scene associated with the Shotlist
        Scene scene = new Scene(shotlist);
        entityManager.persist(scene);

        SceneTextAttributeDefinition sceneDef1 = new SceneTextAttributeDefinition(shotlist, "Text Attribute");
        SceneSingleSelectAttributeDefinition sceneDef2 = new SceneSingleSelectAttributeDefinition(
                shotlist,
                "Scene Single Select Attribute"
        );
        SceneMultiSelectAttributeDefinition sceneDef3 = new SceneMultiSelectAttributeDefinition(
                shotlist,
                "Scene Multi Select Attribute"
        );
        entityManager.persist(sceneDef1);
        entityManager.persist(sceneDef2);
        entityManager.persist(sceneDef3);

        SceneSelectAttributeOptionDefinition sceneOption1 = new SceneSelectAttributeOptionDefinition("Option 1", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption2 = new SceneSelectAttributeOptionDefinition("Option 2", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption3 = new SceneSelectAttributeOptionDefinition("Option 3", sceneDef2);
        SceneSelectAttributeOptionDefinition sceneOption4 = new SceneSelectAttributeOptionDefinition("Option 4", sceneDef3);
        SceneSelectAttributeOptionDefinition sceneOption5 = new SceneSelectAttributeOptionDefinition("Option 5", sceneDef3);
        entityManager.persist(sceneOption1);
        entityManager.persist(sceneOption2);
        entityManager.persist(sceneOption3);
        entityManager.persist(sceneOption4);
        entityManager.persist(sceneOption5);

        // Insert three attributes for the Scene
        SceneAttributeBase sceneAttribute1 = new SceneTextAttribute(sceneDef1, scene);
        SceneAttributeBase sceneAttribute2 = new SceneSingleSelectAttribute(sceneDef2, scene);
        SceneAttributeBase sceneAttribute3 = new SceneMultiSelectAttribute(sceneDef3, scene);
        entityManager.persist(sceneAttribute1);
        entityManager.persist(sceneAttribute2);
        entityManager.persist(sceneAttribute3);

        // Insert a new Shot associated with the Scene
        Shot shot = new Shot(scene);
        entityManager.persist(shot);

        // Define Shot attribute definitions and options
        ShotTextAttributeDefinition shotDef1 = new ShotTextAttributeDefinition(shotlist, "Text Attribute");

        ShotSingleSelectAttributeDefinition shotDef2 = new ShotSingleSelectAttributeDefinition(
                shotlist,
                "Shot Single Select Attribute"
        );
        ShotMultiSelectAttributeDefinition shotDef3 = new ShotMultiSelectAttributeDefinition(
                shotlist,
                "Shot Multi Select Attribute"
        );

        entityManager.persist(shotDef1);
        entityManager.persist(shotDef2);
        entityManager.persist(shotDef3);

        ShotSelectAttributeOptionDefinition shotOption1 = new ShotSelectAttributeOptionDefinition("Option 1", shotDef2);
        ShotSelectAttributeOptionDefinition shotOption2 = new ShotSelectAttributeOptionDefinition("Option 2", shotDef2);
        ShotSelectAttributeOptionDefinition shotOption3 = new ShotSelectAttributeOptionDefinition("Option 3", shotDef3);
        ShotSelectAttributeOptionDefinition shotOption4 = new ShotSelectAttributeOptionDefinition("Option 4", shotDef3);
        ShotSelectAttributeOptionDefinition shotOption5 = new ShotSelectAttributeOptionDefinition("Option 5", shotDef3);
        entityManager.persist(shotOption1);
        entityManager.persist(shotOption2);
        entityManager.persist(shotOption3);
        entityManager.persist(shotOption4);
        entityManager.persist(shotOption5);

        // Insert three attributes for the Shot
        ShotAttributeBase shotAttribute1 = new ShotTextAttribute(shotDef1, shot);
        ShotAttributeBase shotAttribute2 = new ShotSingleSelectAttribute(shotDef2, shot);
        ShotAttributeBase shotAttribute3 = new ShotMultiSelectAttribute(shotDef3, shot);
        entityManager.persist(shotAttribute1);
        entityManager.persist(shotAttribute2);
        entityManager.persist(shotAttribute3);
    }
}