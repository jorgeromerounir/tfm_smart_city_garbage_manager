package com.scgm.containers.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scgm.containers.entity.ContainerEntity;

@Repository
public interface ContainerRepository extends JpaRepository<ContainerEntity, String>, JpaSpecificationExecutor<ContainerEntity> {

    List<ContainerEntity> findByAddressContaining(String address);

    Optional<ContainerEntity> findById(String id);

    List<ContainerEntity> findByCityId(Long cityId);

    List<ContainerEntity> findByCustomerId(Long customerId);

    //-----------------
    @Query(value = """
    WITH random_selection AS (
        SELECT *
        FROM containers
        WHERE
            customer_id = :customerId
            AND city_id = :cityId
        ORDER BY random()
        LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit END
    )
    SELECT * FROM random_selection ORDER BY updated_at DESC;
    """, nativeQuery = true)
    List<ContainerEntity> findRandomByCustomerIdAndCityId(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId,
        @Param("limit") Integer limit);
    
    //-----------------
    @Query(value = """
    SELECT * FROM containers as c
    WHERE
        c.customer_id = :customerId
        AND c.city_id = :cityId
    ORDER BY c.updated_at DESC
    LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit end;
    """, nativeQuery = true)
    List<ContainerEntity> findByCustomerIdAndCityId(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId,
        @Param("limit") Integer limit);

    //-----------------
    @Query(value = """
    SELECT * FROM containers as c
    WHERE
        c.customer_id = :customerId
        AND c.city_id = :cityId
        AND (:hasZoneId IS NULL OR 
             (:hasZoneId = true AND c.zone_id IS NOT NULL) OR 
             (:hasZoneId = false AND c.zone_id IS NULL))
    ORDER BY c.updated_at DESC
    LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit END;
    """, nativeQuery = true)
    List<ContainerEntity> findByCustomerIdAndCityIdWithZoneFilter(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId,
        @Param("limit") Integer limit,
        @Param("hasZoneId") Boolean hasZoneId);

    //-----------------
    @Query(value = """
    SELECT * FROM containers WHERE
        customer_id = :customerId
        AND city_id = :cityId
        AND zone_id = :zoneId
    ORDER BY updated_at DESC
    LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit END;
    """, nativeQuery = true)
    List<ContainerEntity> findByCustomerIdAndCityIdAndZoneId(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId,
        @Param("zoneId") String zoneId,
        @Param("limit") Integer limit
    );

    //-----------------
    @Query(value = """
    SELECT
        SUM(CASE WHEN waste_level_status = 'LIGHT' THEN 1 ELSE 0 END) AS light,
        SUM(CASE WHEN waste_level_status = 'MEDIUM' THEN 1 ELSE 0 END) AS medium,
        SUM(CASE WHEN waste_level_status = 'HEAVY' THEN 1 ELSE 0 END) AS heavy,
        COUNT(*) AS total
    FROM containers WHERE city_id = :cityId;
    """, nativeQuery = true)
    Map<String, Long> getStatusSummary(@Param("cityId") Long cityId);

    //-----------------
    @Query(value = """
    SELECT * FROM containers
    WHERE
        city_id = :cityId
        AND waste_level_status IN (:wasteLevelStatuses);
    """, nativeQuery = true)
    List<ContainerEntity> findByCityAndLevelStatus(
        @Param("cityId") Long cityId, 
        @Param("wasteLevelStatuses") List<String> wasteLevelStatuses);

    //-----------------
    @Modifying
    @Query(value = """
    UPDATE containers 
        SET zone_id = :zoneId, updated_at = NOW()
    WHERE id = :containerId AND customer_id = :customerId
    """, nativeQuery = true)
    int updateZoneIdByContainerIdAndCustomerId(
        @Param("customerId") Long customerId, 
        @Param("containerId") String containerId,
        @Param("zoneId") String zoneId);

}
