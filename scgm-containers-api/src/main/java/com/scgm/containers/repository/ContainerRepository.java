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

    @Query(value = """
    SELECT
        SUM(CASE WHEN waste_level_status = 'LIGHT' THEN 1 ELSE 0 END) AS light,
        SUM(CASE WHEN waste_level_status = 'MEDIUM' THEN 1 ELSE 0 END) AS medium,
        SUM(CASE WHEN waste_level_status = 'HEAVY' THEN 1 ELSE 0 END) AS heavy,
        COUNT(*) AS total
    FROM
        containers
    WHERE
        city_id = :cityId
    """, nativeQuery = true)
    Map<String, Long> getStatusSummary(@Param("cityId") Long cityId);

}
