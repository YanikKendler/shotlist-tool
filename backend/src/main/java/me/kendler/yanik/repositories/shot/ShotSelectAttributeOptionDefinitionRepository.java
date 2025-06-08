package me.kendler.yanik.repositories.shot;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import me.kendler.yanik.dto.shot.ShotSelectAttributeOptionCreateDTO;
import me.kendler.yanik.dto.shot.ShotSelectAttributeOptionEditDTO;
import me.kendler.yanik.dto.shot.ShotSelectAttributeOptionSearchDTO;
import me.kendler.yanik.model.Shotlist;
import me.kendler.yanik.model.scene.attributes.SceneMultiSelectAttribute;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotAttributeDefinitionBase;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotMultiSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSelectAttributeOptionDefinition;
import me.kendler.yanik.model.shot.attributeDefinitions.ShotSingleSelectAttributeDefinition;
import me.kendler.yanik.model.shot.attributes.ShotMultiSelectAttribute;
import org.jboss.logging.Logger;

import java.util.List;

@ApplicationScoped
@Transactional
public class ShotSelectAttributeOptionDefinitionRepository implements PanacheRepository<ShotSelectAttributeOptionDefinition> {
    @Inject
    ShotAttributeDefinitionRepository shotAttributeDefinitionRepository;

    private static final Logger LOGGER = Logger.getLogger(ShotSelectAttributeOptionDefinitionRepository.class);

    public ShotSelectAttributeOptionDefinition create(ShotSelectAttributeOptionCreateDTO createDTO){
        ShotAttributeDefinitionBase shotAttributeDefinition = shotAttributeDefinitionRepository.findById(createDTO.attributeDefinitionId());

        ShotSelectAttributeOptionDefinition shotSelectAttributeOptionDefinition;

        shotSelectAttributeOptionDefinition = new ShotSelectAttributeOptionDefinition(createDTO.name(), shotAttributeDefinition);

        persist(shotSelectAttributeOptionDefinition);

        getEntityManager().createQuery("select s from Shotlist s join s.shotAttributeDefinitions sad where sad = :definition"
                    , Shotlist.class)
                .setParameter("definition", shotAttributeDefinition)
                .getSingleResult()
        .registerEdit();

        return shotSelectAttributeOptionDefinition;
    }

    public List<ShotSelectAttributeOptionDefinition> search(ShotSelectAttributeOptionSearchDTO searchDTO){
        LOGGER.debugf("started search for ShotSelectAttributeOptionDefinition with search term '%s' and attribute definition id %d",
                searchDTO.searchTerm(), searchDTO.shotAttributeDefinitionId());
        List<ShotSelectAttributeOptionDefinition> result = find("lower(name) like lower(concat('%', ?2, '%')) " +
                        "and shotAttributeDefinition.id = ?1 " +
                        "order by name",
                searchDTO.shotAttributeDefinitionId(),
                searchDTO.searchTerm()
        ).list();
        LOGGER.debugf("found %d ShotSelectAttributeOptionDefinitions", result.size());
        return result;
    }

    public ShotSelectAttributeOptionDefinition update(ShotSelectAttributeOptionEditDTO editDTO) {
        ShotSelectAttributeOptionDefinition option = findById(editDTO.id());
        if (option == null) {
            throw new IllegalArgumentException("ShotSelectAttributeOptionDefinition not found");
        }
        option.name = editDTO.name();

        getEntityManager().createQuery("select s from Shotlist s join s.shotAttributeDefinitions sad where sad = :definition"
                , Shotlist.class)
                .setParameter("definition", option.shotAttributeDefinition)
                .getSingleResult()
        .registerEdit();

        return option;
    }

    public ShotSelectAttributeOptionDefinition delete(Long id){
        ShotSelectAttributeOptionDefinition shotSelectAttributeOptionDefinition = findById(id);
        if(shotSelectAttributeOptionDefinition != null) {
            switch (shotSelectAttributeOptionDefinition.shotAttributeDefinition){
                case ShotMultiSelectAttributeDefinition attributeDefinition: {
                    List<ShotMultiSelectAttribute> relevantAttributes = getEntityManager()
                            .createQuery("select sa from ShotMultiSelectAttribute sa where sa.definition = :definition", ShotMultiSelectAttribute.class)
                            .setParameter("definition", attributeDefinition)
                            .getResultList();

                    for (ShotMultiSelectAttribute relevantAttribute : relevantAttributes) {
                        relevantAttribute.value.remove(shotSelectAttributeOptionDefinition);
                    }
                    break;
                }
                case ShotSingleSelectAttributeDefinition attributeDefinition: {
                    getEntityManager().createQuery("update ShotSingleSelectAttribute sa set sa.value = null where sa.definition = :definition")
                            .setParameter("definition", attributeDefinition)
                            .executeUpdate();
                    break;
                }
                default:
                    throw new IllegalStateException("Unexpected value: " + shotSelectAttributeOptionDefinition.shotAttributeDefinition);
            }

            delete(shotSelectAttributeOptionDefinition);

            getEntityManager().createQuery("select s from Shotlist s join s.shotAttributeDefinitions sad where sad = :definition"
                    , Shotlist.class)
                    .setParameter("definition", shotSelectAttributeOptionDefinition.shotAttributeDefinition)
                    .getSingleResult()
            .registerEdit();
        }
        return shotSelectAttributeOptionDefinition;
    }
}
