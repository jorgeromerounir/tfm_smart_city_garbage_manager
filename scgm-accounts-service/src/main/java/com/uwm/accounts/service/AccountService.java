package com.uwm.accounts.service;

import com.uwm.accounts.dto.AccountRequest;
import com.uwm.accounts.dto.AccountResponse;
import com.uwm.accounts.entity.Account;
import com.uwm.accounts.event.AccountEvent;
import com.uwm.accounts.repository.AccountRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @Value("${rabbitmq.exchange}")
    private String exchange;
    
    @Value("${rabbitmq.routing-key}")
    private String routingKey;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        if (accountRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
        
        Account account = new Account(request.name(), request.email(), 
            passwordEncoder.encode(request.password()), request.profile(), request.country());
        account = accountRepository.save(account);
        
        publishEvent("CREATED", account, account.getPassword());
        return mapToResponse(account);
    }
    
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
            .map(this::mapToResponse)
            .toList();
    }
    
    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToResponse(account);
    }
    
    @Transactional
    public AccountResponse updateAccount(Long id, AccountRequest request) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setName(request.name());
        account.setProfile(request.profile());
        account.setCountry(request.country());
        account.setUpdatedAt(LocalDateTime.now());
        
        if (request.password() != null && !request.password().isEmpty()) {
            account.setPassword(passwordEncoder.encode(request.password()));
        }
        
        account = accountRepository.save(account);
        publishEvent("UPDATED", account, null);
        return mapToResponse(account);
    }
    
    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        accountRepository.delete(account);
        publishEvent("DELETED", account, null);
    }
    
    private void publishEvent(String eventType, Account account, String passwordHash) {
        AccountEvent event = new AccountEvent(eventType, account.getId(), 
            account.getEmail(), account.getProfile(), passwordHash);
        log.info("Publishing {} event for user: {} to exchange: {} with routing key: {}", 
            eventType, account.getEmail(), exchange, routingKey);
        rabbitTemplate.convertAndSend(exchange, routingKey, event);
        log.info("Event published successfully");
    }
    
    private AccountResponse mapToResponse(Account account) {
        return new AccountResponse(account.getId(), account.getName(), account.getEmail(),
            account.getProfile(), account.getCountry(), account.getCreatedAt(), account.getUpdatedAt());
    }
}