package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.shot.attributes.ShotAttributeEditDTO;
import me.kendler.yanik.model.shot.attributes.ShotAttributeBase;

@ApplicationScoped
@Transactional
public class ShotAttributeRepository implements PanacheRepository<ShotAttributeBase> {
    public ShotAttributeBase update(ShotAttributeEditDTO editDTO) {
        ShotAttributeBase attribute = findById(editDTO.id());
        if (attribute == null) {
            throw new IllegalArgumentException("Attribute not found");
        }
        attribute.update(editDTO);
        return attribute;
    }
}
