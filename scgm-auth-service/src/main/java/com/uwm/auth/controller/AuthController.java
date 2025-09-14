package com.uwm.auth.controller;

import com.uwm.auth.dto.AuthResponse;
import com.uwm.auth.dto.RefreshRequest;
import com.uwm.auth.dto.SignInRequest;
import com.uwm.auth.dto.AuthEndpointDto;
import com.uwm.auth.service.AuthService;
import com.uwm.auth.service.AuthEndpointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@Slf4j
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Autowired
    private AuthEndpointService authEndpointService;
    
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody SignInRequest request) {
        AuthResponse response = authService.signIn(request.email(), request.password());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        AuthResponse response = authService.refreshToken(request.refreshToken());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/endpoint")
    public ResponseEntity<Void> verifyEndpoint(@RequestBody AuthEndpointDto request) {
        String code = authEndpointService.validate(request);
        log.info("Verification code: {}", code);
        return ResponseEntity.ok().build();
    }

}
