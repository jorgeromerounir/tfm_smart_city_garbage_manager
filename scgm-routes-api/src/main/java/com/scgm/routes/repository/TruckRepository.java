package com.scgm.routes.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.scgm.routes.entity.TruckEntity;

@Repository
public interface TruckRepository extends MongoRepository<TruckEntity, String> {

    List<TruckEntity> findByCustomerIdAndCityIdAndAvailable(Long customerId, Long cityId, Boolean available);

    List<TruckEntity> findByCustomerIdAndCityId(Long customerId, Long cityId, Pageable pageable);

    @Query("{ 'customer_id': ?0, 'city_id': ?1, 'name': { $regex: ?2, $options: 'i' } }")
    List<TruckEntity> findByCustomerIdAndCityIdWithNameContaining(Long customerId, Long cityId, String namePattern, Pageable pageable);

}
