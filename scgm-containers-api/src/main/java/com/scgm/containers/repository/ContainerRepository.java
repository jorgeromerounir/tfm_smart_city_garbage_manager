package com.scgm.containers.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
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
    SELECT * FROM containers
    WHERE
        customer_id = :customerId
        AND city_id = :cityId
    ORDER BY random()
    LIMIT 500;
    """, nativeQuery = true)
    List<ContainerEntity> findByCustomerIdAndCityId(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId);

    //-----------------
    @Query(value = """
    SELECT * FROM containers WHERE
        customer_id = :customerId
        AND city_id = :cityId
        AND latitude BETWEEN :startLat AND :endLat
        AND longitude BETWEEN :startLng AND :endLng
    ORDER BY updated_at DESC
    LIMIT CASE WHEN :limit <= 0 THEN (SELECT COUNT(*) FROM containers) ELSE :limit END;
    """, nativeQuery = true)
    List<ContainerEntity> findByCustomerIdAndCityIdAndBounds(
        @Param("customerId") Long customerId, 
        @Param("cityId") Long cityId,
        @Param("startLat") Double startLat,
        @Param("endLat") Double endLat,
        @Param("startLng") Double startLng,
        @Param("endLng") Double endLng,
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

}
