package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.SceneAttributeEditDTO;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;
import me.kendler.yanik.model.scene.attributes.SceneMultiSelectAttribute;
import me.kendler.yanik.model.scene.attributes.SceneSingleSelectAttribute;
import me.kendler.yanik.model.scene.attributes.SceneTextAttribute;

import java.util.stream.Collectors;

@ApplicationScoped
@Transactional
public class SceneAttributeRepository implements PanacheRepository<SceneAttributeBase> {
    @Inject
    SceneSelectAttributeOptionDefinitionRepository sceneSelectAttributeOptionDefinitionRepository;

    public SceneAttributeBase update(SceneAttributeEditDTO editDTO) {
        SceneAttributeBase attribute = findById(editDTO.id());

        switch (attribute) {
            case null -> {
                throw new IllegalArgumentException("Attribute not found");
            }
            case SceneTextAttribute sceneTextAttribute -> {
                sceneTextAttribute.value = editDTO.textValue();
            }
            case SceneSingleSelectAttribute sceneSingleSelectAttribute -> {
                sceneSingleSelectAttribute.value = sceneSelectAttributeOptionDefinitionRepository.findById(editDTO.singleSelectValue());
            }
            case SceneMultiSelectAttribute sceneMultiSelectAttribute -> {
                sceneMultiSelectAttribute.value = editDTO.multiSelectValue()
                        .stream()
                        .map(id -> sceneSelectAttributeOptionDefinitionRepository.findById(id))
                        .collect(Collectors.toSet());
            }
            default -> {
                throw new IllegalArgumentException("Attribute update failed");
            }
        }

        return attribute;
    }
}
