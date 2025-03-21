package me.kendler.yanik.model.template.shotAttributes;

import java.util.*;

import jakarta.persistence.*;

@Entity
public class ShotMultiSelectAttributeTemplate extends ShotAttributeTemplateBase {
    @OneToMany
    public Set<ShotSelectAttributeOptionTemplate> options;
}