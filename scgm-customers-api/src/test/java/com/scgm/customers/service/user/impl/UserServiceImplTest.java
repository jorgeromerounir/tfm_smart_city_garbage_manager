package com.scgm.customers.service.user.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.scgm.customers.dto.user.UserAddDto;
import com.scgm.customers.dto.user.UserDto;
import com.scgm.customers.dto.user.UserUpdateDto;
import com.scgm.customers.entity.CustomerEntity;
import com.scgm.customers.entity.user.Profile;
import com.scgm.customers.entity.user.UserEntity;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.CustomersLogicException;
import com.scgm.customers.exceptions.user.UserNotFoundException;
import com.scgm.customers.exceptions.user.UserValidationException;
import com.scgm.customers.repository.CustomerRepository;
import com.scgm.customers.repository.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserEntity userEntity;
    private UserAddDto userAddDto;
    private UserUpdateDto userUpdateDto;
    private CustomerEntity customerEntity;

    @BeforeEach
    void setUp() {
        customerEntity = CustomerEntity.builder()
                .id(1L)
                .name("Test Customer")
                .build();

        userEntity = UserEntity.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .profile(Profile.OPERATOR)
                .customerId(1L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        userAddDto = UserAddDto.builder()
                .name("Test User")
                .email("test@example.com")
                .profile(Profile.OPERATOR)
                .customerId(1L)
                .build();

        userUpdateDto = UserUpdateDto.builder()
                .name("Updated User")
                .email("updated@example.com")
                .profile(Profile.ADMIN)
                .customerId(1L)
                .build();
    }

    @Test
    void add_WhenValidUser_ShouldReturnUserDto() {
        // Given
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customerEntity));
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);

        // When
        UserDto result = userService.add(userAddDto);

        // Then
        assertEquals(userEntity.getName(), result.getName());
        assertEquals(userEntity.getEmail(), result.getEmail());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void add_WhenInvalidUserRequest_ShouldThrowUserValidationException() {
        // Given
        userAddDto.setName("");

        // When & Then
        assertThrows(UserValidationException.class, () -> userService.add(userAddDto));
    }

    @Test
    void add_WhenCustomerNotExists_ShouldThrowCustomersLogicException() {
        // Given
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(CustomersLogicException.class, () -> userService.add(userAddDto));
    }

    @Test
    void add_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customerEntity));
        when(userRepository.save(any(UserEntity.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.add(userAddDto));
    }

    @Test
    void findById_WhenUserExists_ShouldReturnUserDto() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));

        // When
        Optional<UserDto> result = userService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(userEntity.getName(), result.get().getName());
    }

    @Test
    void findById_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(userRepository.findById(1L)).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.findById(1L));
    }

    @Test
    void findByNameContaining_WhenValidName_ShouldReturnUserList() {
        // Given
        when(userRepository.findByNameContaining("Test")).thenReturn(Arrays.asList(userEntity));

        // When
        List<UserDto> result = userService.findByNameContaining("Test");

        // Then
        assertEquals(1, result.size());
        assertEquals(userEntity.getName(), result.get(0).getName());
    }

    @Test
    void findByNameContaining_WhenInvalidName_ShouldThrowUserValidationException() {
        // Given
        String invalidName = "<script>";

        // When & Then
        assertThrows(UserValidationException.class, () -> userService.findByNameContaining(invalidName));
    }

    @Test
    void findByNameContaining_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(userRepository.findByNameContaining(anyString())).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.findByNameContaining("Test"));
    }

    @Test
    void findByEmail_WhenValidEmail_ShouldReturnUserDto() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(userEntity));

        // When
        Optional<UserDto> result = userService.findByEmail("test@example.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals(userEntity.getEmail(), result.get().getEmail());
    }

    @Test
    void findByEmail_WhenInvalidEmail_ShouldThrowUserValidationException() {
        // Given
        String invalidEmail = "invalid-email";

        // When & Then
        assertThrows(UserValidationException.class, () -> userService.findByEmail(invalidEmail));
    }

    @Test
    void findByEmail_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(userRepository.findByEmail(anyString())).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.findByEmail("test@example.com"));
    }

    @Test
    void update_WhenValidUpdate_ShouldReturnUpdatedUserDto() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customerEntity));
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);

        // When
        UserDto result = userService.update(1L, userUpdateDto);

        // Then
        assertEquals(userEntity.getName(), result.getName());
        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void update_WhenUserNotFound_ShouldThrowUserNotFoundException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> userService.update(1L, userUpdateDto));
    }

    @Test
    void update_WhenCustomerNotExists_ShouldThrowCustomersLogicException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(CustomersLogicException.class, () -> userService.update(1L, userUpdateDto));
    }

    @Test
    void update_WhenInvalidUserUpdate_ShouldThrowUserValidationException() {
        // Given
        userUpdateDto.setName("");

        // When & Then
        assertThrows(UserValidationException.class, () -> userService.update(1L, userUpdateDto));
    }

    @Test
    void update_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customerEntity));
        when(userRepository.save(any(UserEntity.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.update(1L, userUpdateDto));
    }

    @Test
    void delete_WhenUserExists_ShouldDeleteUser() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);

        // When
        userService.delete(1L);

        // Then
        verify(userRepository).deleteById(1L);
    }

    @Test
    void delete_WhenUserNotExists_ShouldThrowUserNotFoundException() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(UserNotFoundException.class, () -> userService.delete(1L));
    }

    @Test
    void delete_WhenDatabaseError_ShouldThrowCustomerDatabaseException() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);
        doThrow(new RuntimeException("Database error")).when(userRepository).deleteById(1L);

        // When & Then
        assertThrows(CustomerDatabaseException.class, () -> userService.delete(1L));
    }
}