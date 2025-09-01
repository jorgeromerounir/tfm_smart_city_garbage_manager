package com.scgm.customers.repository.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.scgm.customers.entity.user.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {

    List<UserEntity> findByNameContaining(String name);

    Optional<UserEntity> findById(Long id);

    List<UserEntity> findByCustomerId(Long customerId);

    Optional<UserEntity> findByEmail(String email);

}