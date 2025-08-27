package com.scgm.customers.repository.customer;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.scgm.customers.entity.customer.CustomerEntity;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long>, JpaSpecificationExecutor<CustomerEntity> {

    List<CustomerEntity> findByNameContaining(String name);

    Optional<CustomerEntity> findById(Long id);

    List<CustomerEntity> findByCityId(Long cityId);

}
