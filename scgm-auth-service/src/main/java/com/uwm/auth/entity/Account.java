package com.uwm.auth.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class Account {
    @Id
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    public Account(Long id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}