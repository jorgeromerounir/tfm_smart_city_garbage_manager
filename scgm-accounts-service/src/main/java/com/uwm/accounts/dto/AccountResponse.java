package com.uwm.accounts.dto;

import com.uwm.accounts.entity.Account;
import java.time.LocalDateTime;

public record AccountResponse(Long id, String name, String email, Account.Profile profile, String country,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {}