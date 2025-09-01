package com.scgm.customers.service.user.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.customers.dto.user.UserAddDto;
import com.scgm.customers.dto.user.UserDto;
import com.scgm.customers.dto.user.UserUpdateDto;
import com.scgm.customers.entity.CustomerEntity;
import com.scgm.customers.entity.user.UserEntity;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.exceptions.user.UserNotFoundException;
import com.scgm.customers.exceptions.user.UserValidationException;
import com.scgm.customers.repository.CustomerRepository;
import com.scgm.customers.repository.user.UserRepository;
import com.scgm.customers.service.user.UsersService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class UserServiceImpl implements UsersService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDto add(UserAddDto userAdd) {
        var reqListErrors = userAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new UserValidationException("Trying to add: error user request validation.", reqListErrors);
        var customerOpt = customerRepository.findById(userAdd.getCustomerId());
        if (customerOpt.isEmpty()) {
            var msg = String.format("The customer: %s doesn't exists.", userAdd.getCustomerId());
            throw new CustomersLogicException(msg);
        }
        var userEntity = UserAddDto.toEntity(userAdd);
        var listErrors = userEntity.validate();
        if (!listErrors.isEmpty())
            throw new UserValidationException("Trying to add: error user entity validation.", listErrors);
        try {
            return UserDto.toDto(userRepository.save(userEntity));
        } catch (Exception e) {
            log.error("Error trying to add user with name: {}", userEntity.getName(), e);
            throw new CustomerDatabaseException("Error trying to add user", e);
        }
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        try {
            return userRepository.findById(id).map(UserDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find user with ID: {}", id, e);
            throw new CustomerDatabaseException("Error trying to find user", e);
        }
    }

    @Override
    public List<UserDto> findByNameContaining(String name) {
        if(!UserEntity.INJECTION_PATTERN.matcher(name).matches())
            throw new UserValidationException("Trying to find by name: invalid name");
        try {
            List<UserEntity> users = userRepository.findByNameContaining(name);
            return users.stream().map(UserDto::toDto).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find users by name", e);
            throw new CustomerDatabaseException("Error trying to find users by name", e);
        }
    }

    @Override
    public List<UserDto> findByCustomerId(Long customerId) {
        try {
            return userRepository.findByCustomerId(customerId).stream().map(UserDto::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error trying to find users for customer with ID: {}", customerId, e);
            throw new CustomerDatabaseException("Error trying to find users by customer ID", e);
        }
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        if(!UserEntity.EMAIL_PATTERN.matcher(email).matches())
            throw new UserValidationException("Trying to find by email: invalid email");
        try {
            return userRepository.findByEmail(email).map(UserDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find user with email: {}", email, e);
            throw new CustomerDatabaseException("Error trying to find user by email", e);
        }
    }

    @Override
    @Transactional
    public UserDto update(Long userId, UserUpdateDto userUpdate) {
        var reqListErrors = userUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new UserValidationException("Trying to update: error user request validation.", reqListErrors);
        var userOpt = userRepository.findById(userId);
        userOpt.orElseThrow(() -> new UserNotFoundException(userId));
        Optional<CustomerEntity> customerOpt = customerRepository.findById(userUpdate.getCustomerId());
        if (customerOpt.isEmpty()) {
            var msg = String.format("The customer: %s doesn't exists,", userUpdate.getCustomerId());
            throw new CustomersLogicException(msg);
        }
        UserEntity existingUser = userOpt.get();
        existingUser.setName(userUpdate.getName());
        existingUser.setEmail(userUpdate.getEmail());
        existingUser.setProfile(userUpdate.getProfile());
        existingUser.setCustomerId(userUpdate.getCustomerId());
        existingUser.setUpdatedAt(Instant.now());
        var listErrors = existingUser.validate();
        if (!listErrors.isEmpty())
            throw new UserValidationException("Trying to update: error user entity validation.", listErrors);
        try {
            return UserDto.toDto(userRepository.save(existingUser));
        } catch (Exception e) {
            log.error("Error trying to update user with ID: {}", existingUser.getId(), e);
            throw new CustomerDatabaseException("Error trying to update user", e);
        }
    }

    @Override
    @Transactional
    public void delete(Long userId) {
        if (!userRepository.existsById(userId))
            throw new UserNotFoundException(userId);
        try {
            userRepository.deleteById(userId);
            log.debug("User with ID: {} deleted successfully.", userId);
        } catch (Exception e) {
            log.error("Error trying to delete user with ID: {}", userId, e);
            throw new CustomerDatabaseException("Error trying to delete user", e);
        }
    }

}