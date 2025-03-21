package me.kendler.yanik.model.template.sceneAttributes;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class SceneSingleSelectAttributeTemplate extends SceneAttributeTemplateBase {
    @OneToMany
    public Set<SceneSelectAttributeOptionTemplate> options;
}