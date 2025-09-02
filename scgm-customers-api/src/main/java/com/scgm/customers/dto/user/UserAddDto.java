package com.scgm.customers.dto.user;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.scgm.customers.entity.user.Profile;
import com.scgm.customers.entity.user.UserEntity;
import org.apache.commons.lang3.StringUtils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddDto {

    private String name;
    private String email;
    private Profile profile;
    private Long customerId;
    private String password;

    public static UserEntity toEntity(UserAddDto userDto) {
        Instant currentInstant = Instant.now();
        return UserEntity.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .profile(userDto.getProfile())
                .customerId(userDto.getCustomerId())
                .createdAt(currentInstant)
                .updatedAt(currentInstant)
                .build();
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (name == null || name.trim().isEmpty())
            listErrors.add("name: cannot be empty");
        if (email == null || email.trim().isEmpty())
            listErrors.add("email: cannot be empty");
        if (profile == null)
            listErrors.add("profile: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        if (StringUtils.isBlank(password)) {
            listErrors.add("password: is required");
        } else if (!UserEntity.PASSWORD_PATTERN.matcher(password).matches()) {
            listErrors.add("password: invalid format");
        }
        return listErrors;
    }

}