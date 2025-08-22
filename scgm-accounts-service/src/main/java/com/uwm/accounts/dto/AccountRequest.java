package com.uwm.accounts.dto;

import com.uwm.accounts.entity.Account;

public record AccountRequest(String name, String email, String password, Account.Profile profile, String country) {}