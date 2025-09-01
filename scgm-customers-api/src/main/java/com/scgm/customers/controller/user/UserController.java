package com.scgm.customers.controller.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scgm.customers.dto.user.UserAddDto;
import com.scgm.customers.dto.user.UserDto;
import com.scgm.customers.dto.user.UserUpdateDto;
import com.scgm.customers.service.user.UsersService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
@Slf4j
public class UserController {

    private final UsersService usersService;

    @PostMapping
    public ResponseEntity<UserDto> add(@RequestBody UserAddDto userAdd) {
        log.debug("Trying to add new user");
        var userDto = usersService.add(userAdd);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        log.debug("Finding user with ID: {}", id);
        var userOpt = usersService.findById(id);
        return userOpt.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<UserDto>> findByNameContaining(@RequestParam String name) {
        log.debug("Finding users by name containing");
        List<UserDto> users = usersService.findByNameContaining(name);
        if (users.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/by-customer/{customerId}")
    public ResponseEntity<List<UserDto>> findByCustomerId(@PathVariable Long customerId) {
        log.debug("Finding users for customer with ID: {}", customerId);
        List<UserDto> users = usersService.findByCustomerId(customerId);
        if (users.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserDto> findByEmail(@RequestParam String email) {
        log.debug("Finding user by email.");
        var userOpt = usersService.findByEmail(email);
        return userOpt.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> update(@PathVariable Long userId, 
        @RequestBody UserUpdateDto userUpdate) {
        log.debug("Trying to update user with ID: {}", userId);
        var userDto = usersService.update(userId, userUpdate);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(@PathVariable Long userId) {
        log.debug("Trying to delete user with ID: {}", userId);
        usersService.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}