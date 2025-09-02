package com.uwm.auth.service;

import com.uwm.auth.dto.AuthResponse;
import com.uwm.auth.entity.Session;
import com.uwm.auth.entity.Account;
import com.uwm.auth.repository.AccountRepository;
import com.uwm.auth.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final SessionRepository sessionRepository;
    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse signIn(String email, String password) {
        var accountOpt = accountRepository.findByEmail(email);
        // Validate credentials against accounts service
        if (!validateCredentialsOpt(accountOpt, email, password)) {
            throw new RuntimeException("Invalid credentials");
        }
        var account = accountOpt.get();
        // Clean up existing sessions for this user
        sessionRepository.deleteByEmail(account.getEmail());

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(account.getEmail(), account.getClaims());
        String refreshToken = jwtService.generateRefreshToken(account.getEmail(), account.getClaims());

        // Save session
        Session session = new Session(email, refreshToken,
            LocalDateTime.now().plusSeconds(604800)); // 7 days
        sessionRepository.save(session);
        return new AuthResponse(accessToken, refreshToken);
    }

    private boolean validateCredentials(String email, String password) {
        return accountRepository.findByEmail(email)
            .map(account -> passwordEncoder.matches(password, account.getPassword()))
            .orElse(false);
    }

    private boolean validateCredentialsOpt(Optional<Account> accountOpt, String email, String password) {
        return accountOpt.map(account -> passwordEncoder.matches(password, account.getPassword()))
            .orElse(false);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        Session session = sessionRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            sessionRepository.delete(session);
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtService.generateAccessToken(session.getEmail());
        return new AuthResponse(newAccessToken, refreshToken);
    }

    @Transactional
    public void logout(String refreshToken) {
        sessionRepository.findByRefreshToken(refreshToken)
            .ifPresent(sessionRepository::delete);
    }

    @Transactional
    public void cleanupExpiredSessions() {
        sessionRepository.deleteExpiredSessions(LocalDateTime.now());
    }
}
