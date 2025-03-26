package me.kendler.yanik.model.scene.attributes;

import java.util.*;

import jakarta.persistence.*;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneMultiSelectAttributeDefinition;
import me.kendler.yanik.model.scene.attributeDefinitions.SceneSelectAttributeOptionDefinition;

@Entity
public class SceneMultiSelectAttribute extends SceneAttributeBase {
    @ManyToOne
    public SceneMultiSelectAttributeDefinition definition;
    @OneToMany
    public List<SceneSelectAttributeOptionDefinition> value;
}