package com.scgm.routes.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.scgm.routes.entity.TruckEntity;

@Repository
public interface TruckRepository extends MongoRepository<TruckEntity, String> {

    List<TruckEntity> findByCustomerIdAndCityIdAndAvailable(Long customerId, Long cityId, Boolean available);

}
