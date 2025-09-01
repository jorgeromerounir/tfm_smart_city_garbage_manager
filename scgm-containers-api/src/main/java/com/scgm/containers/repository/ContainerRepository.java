package com.scgm.containers.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.scgm.containers.entity.ContainerEntity;

@Repository
public interface ContainerRepository extends JpaRepository<ContainerEntity, String>, JpaSpecificationExecutor<ContainerEntity> {

    List<ContainerEntity> findByAddressContaining(String address);

    Optional<ContainerEntity> findById(String id);

    List<ContainerEntity> findByCityId(Long cityId);

    List<ContainerEntity> findByCustomerId(Long customerId);

}