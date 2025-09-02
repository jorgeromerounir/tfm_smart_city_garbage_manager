package com.scgm.customers.event;

public record AccountEvent(String eventType, Long accountId, String email, String profile, String password) {}