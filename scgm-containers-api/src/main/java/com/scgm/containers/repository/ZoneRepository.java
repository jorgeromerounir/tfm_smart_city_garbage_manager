package com.scgm.containers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.scgm.containers.entity.ZoneEntity;

@Repository
public interface ZoneRepository extends JpaRepository<ZoneEntity, String> {

    //-----------------
    @Query(value = """
    SELECT z.* FROM zones z
    WHERE
        customer_id = :customerId
        AND city_id = :cityId
    order by z.updated_at desc;
    """, nativeQuery = true)
    List<ZoneEntity> findByCustomerIdAndCityId(@Param("customerId") Long customerId, 
        @Param("cityId") Long cityId);

}