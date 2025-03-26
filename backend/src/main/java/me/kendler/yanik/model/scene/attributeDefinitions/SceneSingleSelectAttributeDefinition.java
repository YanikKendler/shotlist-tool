package me.kendler.yanik.model.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class SceneSingleSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    @OneToMany
    public Set<SceneSelectAttributeOptionDefinition> options;
}