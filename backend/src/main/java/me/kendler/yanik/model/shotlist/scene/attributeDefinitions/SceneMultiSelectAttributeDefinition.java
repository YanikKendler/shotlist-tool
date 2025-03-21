package me.kendler.yanik.model.shotlist.scene.attributeDefinitions;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class SceneMultiSelectAttributeDefinition extends SceneAttributeDefinitionBase {
    @OneToMany()
    public Set<SceneSelectAttributeOptionDefinition> options;
}