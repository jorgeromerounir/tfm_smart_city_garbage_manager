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

@ExtendWith(SpringExtension.class)
@Slf4j
class AuthEndpointServiceTest {

    @MockBean
    private JwtService jwtServiceMock;

    private AuthEndpointService authEndpointService;
    
    @BeforeEach
    void setUp() {
        // Given: JwtService mock setup
        this.authEndpointService = new AuthEndpointService(jwtServiceMock);
    }

    @Test
    void validate_ShouldThrowException_WhenDtoValidationFails() {
        // Given: Invalid AuthEndpointDto with null values
        AuthEndpointDto invalidDto = AuthEndpointDto.builder()
                .url(null)
                .method(null)
                .accessToken(null)
                .build();
        // When & Then: Validation should throw UnauthorizedException
        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authEndpointService.validate(invalidDto);
        });
        assertTrue(exception.getMessage().contains("- url: cannot be empty"));
        assertTrue(exception.getMessage().contains("- method: cannot be empty"));
    }

    @Test
    void validate_ShouldThrowException_WhenUrlIsNotAllowed() {
        // Given: DTO with malformed URL
        AuthEndpointDto dtoWithInvalidUrl = AuthEndpointDto.builder()
                .url("invalid-url-format")
                .method("GET")
                .accessToken("valid-token")
                .build();
        when(jwtServiceMock.isTokenValid(anyString())).thenReturn(true);
        // When & Then: Should throw UnauthorizedException for invalid URL
        UnauthorizedException exception = assertThrows(UnauthorizedException.class, () -> {
            authEndpointService.validate(dtoWithInvalidUrl);
        });
        assertEquals("Request URL not allowed", exception.getMessage());
    }

    @Test
    void validate_ShouldPass_WhenUrlIsInWhitelist() {
        // Given: Valid DTO with URL in whitelist
        AuthEndpointDto whitelistedDto = AuthEndpointDto.builder()
                .url("http://example.com/api/v1/users/whitelist-test-alloweb")
                .method("GET")
                .accessToken("valid-token")
                .build();
        when(jwtServiceMock.isTokenValid(anyString())).thenReturn(true);

        // When & Then: Should not throw exception for whitelisted URL
        var code = authEndpointService.validate(whitelistedDto);
        assertEquals("ACCESS_ALLOWED_FROM_WHITE_LIST", code);
    }

}