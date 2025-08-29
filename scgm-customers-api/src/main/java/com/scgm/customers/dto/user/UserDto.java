package com.scgm.customers.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

import com.scgm.customers.entity.CustomerEntity;
import com.scgm.customers.entity.user.Profile;
import com.scgm.customers.entity.user.UserEntity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;
    private String name;
    private String email;
    private Profile profile;
    private Long customerId;
    private Instant createdAt;
    private Instant updatedAt;

    public static UserEntity toEntity(UserDto userDto) {
        return UserEntity.builder()
                .id(userDto.getId())
                .name(userDto.getName())
                .email(userDto.getEmail())
                .profile(userDto.getProfile())
                .customerId(userDto.getCustomerId())
                .createdAt(userDto.getCreatedAt())
                .updatedAt(userDto.getUpdatedAt())
                .build();
    }

    public static UserDto toDto(UserEntity userEntity) {
        return UserDto.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .profile(userEntity.getProfile())
                .customerId(userEntity.getCustomerId())
                .createdAt(userEntity.getCreatedAt())
                .updatedAt(userEntity.getUpdatedAt())
                .build();
    }
}