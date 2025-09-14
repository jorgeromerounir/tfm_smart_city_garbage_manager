package com.uwm.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(name = "refresh_token", nullable = false, unique = true)
    private String refreshToken;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Convert(converter = MapToStringConverter.class)
    @Column(columnDefinition = "json", nullable = true)
    private Map<String, String> claims;

    public Session(String email, String refreshToken, LocalDateTime expiresAt, Map<String, String> claims) {
        this.email = email;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.claims = claims;
    }
}
