package com.uwm.auth.event;

public record AccountEvent(String eventType, Long accountId, String email, String profile, String password) {}