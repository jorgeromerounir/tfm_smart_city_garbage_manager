package com.uwm.accounts.event;

import com.uwm.accounts.entity.Account;

public record AccountEvent(String eventType, Long accountId, String email, Account.Profile profile, String password) {}
