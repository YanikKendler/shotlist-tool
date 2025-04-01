package me.kendler.yanik.dto.shot;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeBaseDTO;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeBaseDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.Scene;
import me.kendler.yanik.model.shot.Shot;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public record ShotDTO (
    UUID id,
    Scene scene,
    Set<ShotAttributeBaseDTO> attributes,
    int number,
    boolean isSubshot,
    LocalDateTime createdAt
){ }
