package com.scgm.routes.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.scgm.routes.entity.RouteAssignmentEntity;
import com.scgm.routes.entity.RouteAssignmentEntity.AssignmentStatus;

@Repository
public interface RouteAssignmentRepository extends MongoRepository<RouteAssignmentEntity, String> {

    List<RouteAssignmentEntity> findByTruckId(String truckId);
    
    List<RouteAssignmentEntity> findByOperatorId(String operatorId);
    
    List<RouteAssignmentEntity> findBySupervisorId(String supervisorId);
    
    List<RouteAssignmentEntity> findByCityId(Long cityId);
    
    List<RouteAssignmentEntity> findByStatus(AssignmentStatus status);
    
    List<RouteAssignmentEntity> findByOperatorIdAndStatus(String operatorId, AssignmentStatus status);

}
