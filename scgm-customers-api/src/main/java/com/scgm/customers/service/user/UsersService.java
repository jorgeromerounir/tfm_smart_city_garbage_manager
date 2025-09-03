package com.scgm.customers.service.user;

import java.util.List;
import java.util.Optional;

import com.scgm.customers.dto.user.UserAddDto;
import com.scgm.customers.dto.user.UserDto;
import com.scgm.customers.dto.user.UserUpdateDto;
import com.scgm.customers.entity.user.Profile;


public interface UsersService {

    public UserDto add(UserAddDto userAdd);

    public Optional<UserDto> findById(Long id);

    public List<UserDto> findByNameContaining(String name);

    public List<UserDto> findByCustomerId(Long customerId);

    public List<UserDto> findByCustomerIdAndProfile(Long customerId, Profile profile);

    public Optional<UserDto> findByEmail(String email);

    public UserDto update(Long userId, UserUpdateDto userUpdate);

    public void delete(Long userId);    

}