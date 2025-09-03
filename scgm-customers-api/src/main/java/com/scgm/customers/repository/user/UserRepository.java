package com.scgm.customers.repository.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.scgm.customers.entity.user.UserEntity;
import com.scgm.customers.entity.user.Profile;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {

    List<UserEntity> findByNameContaining(String name);

    Optional<UserEntity> findById(Long id);

    List<UserEntity> findByCustomerId(Long customerId);

    List<UserEntity> findByCustomerIdAndProfile(Long customerId, Profile profile);

    Optional<UserEntity> findByEmail(String email);

}