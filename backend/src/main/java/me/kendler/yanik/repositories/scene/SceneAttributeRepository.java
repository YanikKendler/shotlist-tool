package me.kendler.yanik.repositories.scene;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.scene.attributes.SceneAttributeEditDTO;
import me.kendler.yanik.model.scene.attributes.SceneAttributeBase;

import java.util.UUID;

@ApplicationScoped
@Transactional
public class SceneAttributeRepository implements PanacheRepository<SceneAttributeBase> {
    public SceneAttributeBase update(SceneAttributeEditDTO editDTO) {
        SceneAttributeBase attribute = findById(editDTO.id());
        if (attribute == null) {
            throw new IllegalArgumentException("Attribute not found");
        }
        attribute.update(editDTO);
        return attribute;
    }
}
