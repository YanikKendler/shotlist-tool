package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.shot.ShotSelectAttributeCreateDTO;
import me.kendler.yanik.dto.shot.ShotSelectAttributeOptionSearchDTO;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;

import java.util.List;

@ApplicationScoped
@Transactional
public class ShotSelectAttributeOptionDefinitionRepository implements PanacheRepository<ShotSelectAttributeOptionDefinition> {
    @Inject
    ShotAttributeDefinitionRepository shotAttributeDefinitionRepository;

    public ShotSelectAttributeOptionDefinition create(ShotSelectAttributeCreateDTO createDTO){
        ShotAttributeDefinitionBase shotAttributeDefinition = shotAttributeDefinitionRepository.findById(createDTO.selectAttributeId());
        ShotSelectAttributeOptionDefinition shotSelectAttributeOptionDefinition = new ShotSelectAttributeOptionDefinition(createDTO.name(), shotAttributeDefinition);
        persist(shotSelectAttributeOptionDefinition);
        return shotSelectAttributeOptionDefinition;
    }

    public List<ShotSelectAttributeOptionDefinition> search(ShotSelectAttributeOptionSearchDTO searchDTO){
        return find("lower(name) like lower(concat('%', ?2, '%')) " +
                        "and shotAttributeDefinition.id = ?1 " +
                        "order by name",
                searchDTO.shotAttributeDefinitionId(),
                searchDTO.searchTerm()
        ).list();
    }

    public ShotSelectAttributeOptionDefinition delete(Long id){
        ShotSelectAttributeOptionDefinition shotSelectAttributeOptionDefinition = findById(id);
        if(shotSelectAttributeOptionDefinition != null) {
            delete(shotSelectAttributeOptionDefinition);
        }
        return shotSelectAttributeOptionDefinition;
    }
}
