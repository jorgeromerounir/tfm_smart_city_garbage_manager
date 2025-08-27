package com.scgm.customers.repository.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.scgm.customers.entity.customer.CityEntity;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<CityEntity, Long>, JpaSpecificationExecutor<CityEntity> {

    List<CityEntity> findByNameContaining(String name);
    
    List<CityEntity> findByCountry(String country);
}
