package com.uwm.auth.event;

import com.uwm.auth.entity.Account;
import com.uwm.auth.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountEventListener {
    
    private final AccountRepository accountRepository;
    
    @RabbitListener(queues = "auth.queue")
    public void handleAccountEvent(AccountEvent event) {
        log.info("Received account event: {} for user: {}", event.eventType(), event.email());
        switch (event.eventType()) {
            case "CREATED":
                Account account = new Account(event.accountId(), event.email(), event.password());
                accountRepository.save(account);
                log.info("Created user in auth service: {}", event.email());
                break;
            case "DELETED":
                accountRepository.deleteById(event.accountId());
                log.info("Deleted user from auth service: {}", event.email());
                break;
        }
    }
}