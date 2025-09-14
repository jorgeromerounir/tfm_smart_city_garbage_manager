package com.uwm.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public JwtService() {
        // Constructor by default for Spring
    }

    public JwtService(String secret, long accessTokenExpiration, long refreshTokenExpiration) {
        this.secret = secret;
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(String email, Map<String, String> claims) {
        return Jwts.builder()
            .subject(email)
            .claims(claims)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String generateRefreshToken(String email, Map<String, String> claims) {
        return Jwts.builder()
            .subject(email)
            .claims(claims)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.error("Error trying to validate token", e);
            return false;
        }
    }

    public boolean isValid(String token) {
        try {
            //return !isTokenExpired(token);
            var claims = extractClaims(token);
            log.info("-----> claims: {}", claims);
            return claims.get("userId") != null;
        } catch (Exception e) {
            log.error("Error trying to extract token Claims", e);
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
