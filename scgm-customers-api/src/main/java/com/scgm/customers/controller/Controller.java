package com.scgm.customers.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;

@RestController
public class Controller {

    @Value("${spring.application.name}") 
    private String appName;

    @Value("${spring.application.version}") 
    private String appVersion;

    @Value("${spring.application.description}") 
    private String appDescription;

    @GetMapping("/")
    public ResponseEntity<String> get() {
        return ResponseEntity.ok("Hello from: " + appName + " version: " + appVersion + 
            "\nDescription: " + appDescription);
    }
}