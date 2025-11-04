package com.scgm.containers.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.scgm.containers.dto.ContainerSearchParamsDto;
import com.scgm.containers.entity.ContainerEntity;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Repository
public class ContainerRepositoryImpl implements ContainerRepositoryCustom {
    
    private static final Logger logger = LoggerFactory.getLogger(ContainerRepositoryImpl.class);
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    @SuppressWarnings("unchecked")
    public List<ContainerEntity> findByCustomerIdAndCityIdPaginatedDynamic(
            Long customerId, Long cityId, ContainerSearchParamsDto searchParams) {
        logger.info("Search params: {}", searchParams);
        
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT * FROM containers WHERE customer_id = :customerId AND city_id = :cityId");
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("customerId", customerId);
        parameters.put("cityId", cityId);
        parameters.put("limit", searchParams.getLimit());
        
        if (searchParams.getAddressCoincidence() != null) {
            sql.append(" AND LOWER(address) LIKE LOWER(:addressCoincidence)");
            parameters.put("addressCoincidence", "%" + searchParams.getAddressCoincidence() + "%");
        }
        if (searchParams.getZoneId() != null) {
            sql.append(" AND zone_id = :zoneId");
            parameters.put("zoneId", searchParams.getZoneId());
        }
        if (searchParams.getWasteLevelStatus() != null) {
            sql.append(" AND waste_level_status = :wasteLevelStatus");
            parameters.put("wasteLevelStatus", searchParams.getWasteLevelStatus().toString());
        }
        if (searchParams.getBetweenLatitude() != null) {
            sql.append(" AND ABS(latitude - :betweenLatitude) <= 0.01");
            parameters.put("betweenLatitude", searchParams.getBetweenLatitude());
        }
        if (searchParams.getBetweenLongitude() != null) {
            sql.append(" AND ABS(longitude - :betweenLongitude) <= 0.01");
            parameters.put("betweenLongitude", searchParams.getBetweenLongitude());
        }
        sql.append(" ORDER BY updated_at DESC");
        sql.append(" LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit end;");
        
        logger.info("SQL Query: {}", sql.toString());
        
        Query query = entityManager.createNativeQuery(sql.toString(), ContainerEntity.class);
        parameters.forEach(query::setParameter);
        return query.getResultList();
    }
}