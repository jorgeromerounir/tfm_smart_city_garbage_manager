package com.uwm.auth.service;

import com.uwm.auth.dto.AuthEndpointDto;
import com.scgm.customers.exceptions.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Map;

@ExtendWith(SpringExtension.class)
@Slf4j
class AuthEndpointServiceTokenSimulationTest {

    private AuthEndpointService authEndpointService;

    private JwtService jwtService;
    
    @BeforeEach
    void setUp() {
        String secret = "test-token-secret-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=";
        long accessTokenExpiration = 900000L;
        long refreshTokenExpiration = 604800000L;
        this.jwtService = new JwtService(secret, accessTokenExpiration, refreshTokenExpiration);
        // Given: JwtService mock setup
        this.authEndpointService = new AuthEndpointService(this.jwtService);
    }

    @Test
    void validate_ShouldThrowException_WhenUrlAccessNotEnabled() {
        // Given:
        Map<String, String> testClaims = Map.of("userId", "1");
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/not-enabled")
                .method("GET")
                .accessToken(accessToken)
                .build();

        // When & Then:
        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authEndpointService.validate(authEndpointDto);
        });
        assertEquals("Invalid access URL is disabled", exception.getMessage());
    }

    @Test
    void validate_ShouldThrowException_WhenRequiredCustomer() {
        // Given:
        Map<String, String> testClaims = Map.of(
            "profile", "ADMIN",
            "userId", "1",
            "customerId", "1"
        );
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/require-customer")
                .method("GET")
                .userId("1")
                .customerId("222")
                .accessToken(accessToken)
                .build();

        // When & Then:
        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authEndpointService.validate(authEndpointDto);
        });
        assertEquals("Invalid access from customer", exception.getMessage());
    }

    @Test
    void validate_ShouldThrowException_WhenInvalidProfile() {
        // Given:
        Map<String, String> testClaims = Map.of(
            "profile", "SUPERVISOR",
            "userId", "1",
            "customerId", "1"
        );
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/invalid-profile")
                .method("GET")
                .userId("1")
                .customerId("1")
                .accessToken(accessToken)
                .build();

        // When & Then:
        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authEndpointService.validate(authEndpointDto);
        });
        assertEquals("Invalid access from profile", exception.getMessage());
    }

    @Test
    void validate_ShouldPass_WhenAllowAllProfiles() {
        // Given:
        Map<String, String> testClaims = Map.of(
            "profile", "SUPERVISOR",
            "userId", "1",
            "customerId", "1"
        );
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/allow-all-profiles")
                .method("GET")
                .userId("1")
                .customerId("1")
                .accessToken(accessToken)
                .build();

        // When & Then:
        String code = authEndpointService.validate(authEndpointDto);
        assertEquals("ACCESS_ALLOWED_ALL_PROFILES", code);
    }

    @Test
    void validate_ShouldPass_WhenAllowSpecificProfile() {
        // Given:
        Map<String, String> testClaims = Map.of(
            "profile", "ADMIN",
            "userId", "1",
            "customerId", "1"
        );
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/allow-specific-profile")
                .method("GET")
                .userId("1")
                .customerId("1")
                .accessToken(accessToken)
                .build();

        // When & Then:
        String code = authEndpointService.validate(authEndpointDto);
        assertEquals("ACCESS_ALLOWED_BY_PROFILE", code);
    }

    @Test
    void validate_ShouldPass_WhenAllowSpecificProfileCase2() {
        // Given:
        Map<String, String> testClaims = Map.of(
            "profile", "OPERATOR",
            "userId", "1",
            "customerId", "1"
        );
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/allow-specific-profile-case2")
                .method("GET")
                .userId("1")
                .customerId("1")
                .accessToken(accessToken)
                .build();

        // When & Then:
        String code = authEndpointService.validate(authEndpointDto);
        assertEquals("ACCESS_ALLOWED_BY_PROFILE", code);
    }

    @Test
    void validate_ShouldPass_WhenWhiteListAlloweb() {
        // Given:
        Map<String, String> testClaims = Map.of();
        var accessToken = this.jwtService.generateAccessToken("test.email@test.com", testClaims);
        AuthEndpointDto authEndpointDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/whitelist-test-alloweb")
                .method("GET")
                .customerId("1")
                .accessToken(accessToken)
                .build();

        // When & Then:
        String code = authEndpointService.validate(authEndpointDto);
        assertEquals("ACCESS_ALLOWED_FROM_WHITE_LIST", code);
    }

}
