package com.scgm.customers.event;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AccountEventProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${scgm.rabbitmq.queue.auth:auth.queue}")
    private String authQueue;

    public AccountEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        this.rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
    }

    public void sendAccountEvent(AccountEvent accountEvent) {
        try {
            log.debug("Sending account event: {}", accountEvent);
            rabbitTemplate.convertAndSend(authQueue, accountEvent);
            log.info("Account event sent successfully for account ID: {}", accountEvent.getAccountId());
        } catch (Exception e) {
            log.error("Error sending account event for account ID: {}", accountEvent.getAccountId(), e);
            throw new RuntimeException("Failed to send account event", e);
        }
    }

}