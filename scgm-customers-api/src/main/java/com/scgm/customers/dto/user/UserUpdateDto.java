package com.scgm.customers.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.scgm.customers.entity.user.Profile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDto {

    private String name;
    private String email;
    private Profile profile;
    private Long customerId;

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
        return listErrors;
    }

}