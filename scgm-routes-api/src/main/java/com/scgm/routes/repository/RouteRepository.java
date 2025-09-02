package com.scgm.routes.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.scgm.routes.entity.RouteEntity;
import com.scgm.routes.entity.RouteEntity.RouteStatus;

@Repository
public interface RouteRepository extends MongoRepository<RouteEntity, String> {

    List<RouteEntity> findByCityId(Long cityId);
    
    List<RouteEntity> findByCustomerId(Long customerId);
    
    List<RouteEntity> findByRouteStatus(RouteStatus routeStatus);
    
    List<RouteEntity> findByScheduledDate(LocalDate scheduledDate);
    
    List<RouteEntity> findByCityIdAndRouteStatus(Long cityId, RouteStatus routeStatus);

}