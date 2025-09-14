package com.uwm.auth.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uwm.auth.dto.AccessConfigDto;
import com.uwm.auth.dto.AccessConfigDto.UrlAccess;
import com.uwm.auth.dto.AuthEndpointDto;
import com.scgm.customers.exceptions.UnauthorizedException;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class AuthEndpointService {

    private static final String METHOD_PATH_SEPARATOR = "::";
    private static final String JWT_BEARER_PREFIX = "Bearer ";
    
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    private final AccessConfigDto accessConfig;

    public AuthEndpointService(JwtService jwtService) {
        this.jwtService = jwtService;
        this.objectMapper = new ObjectMapper();
        this.accessConfig = loadAccessConfig();
    }

    private AccessConfigDto loadAccessConfig() {
        try {
            ClassPathResource resource = new ClassPathResource("auth_endpoint_config.json");
            AccessConfigDto config = objectMapper.readValue(resource.getInputStream(), AccessConfigDto.class);
            var configErrors = config.validate();
            if (!configErrors.isEmpty())
                throw new IllegalStateException("Invalid access configuration from JSON file: " + configErrors.toString());
            String jsonFormatted = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(config);
            log.info("Access config: {}", jsonFormatted);
            return config;
        } catch (IOException e) {
            throw new IllegalStateException("Error loading access configuration, invalid JSON file");
        }
    }

    public String validate(AuthEndpointDto verifyDto) {
        var dtoErrors = verifyDto.validate();
        if (!dtoErrors.isEmpty())
            throw new UnauthorizedException("Invalid access request", dtoErrors);
        String path = getVerifyUrlPath(verifyDto);
        String reqKey = verifyDto.getMethod() + METHOD_PATH_SEPARATOR + path;
        log.info("initial reqKey: {}", reqKey);
        var patternKeyUrlWhiteList = findMatchingUrlWhiteList(reqKey);
        if (this.containsWhiteListUrl(patternKeyUrlWhiteList))
            return "ACCESS_ALLOWED_FROM_WHITE_LIST";
        var patternKeyUrlToValidate = findMatchingUrlToValidate(reqKey);
        if (this.containsUrlToValidate(patternKeyUrlToValidate)) {
            return this.urlToValidateAuth(verifyDto, patternKeyUrlToValidate);
        } else {
            // By default all URL' not allowed
            throw new UnauthorizedException("Request URL not allowed");
        }
    }

    public String findMatchingUrlToValidate(String reqKey) {
        for (String patternKey : this.accessConfig.getUrlToValidate().keySet()) {
            Pattern pattern = Pattern.compile(patternKey);
            Matcher matcher = pattern.matcher(reqKey);
            if (matcher.matches()) {
                return patternKey;
            }
        }
        return null; // No matching pattern was found.
    }

    public String findMatchingUrlWhiteList(String reqKey) {
        for (String patternKey : this.accessConfig.getUrlWhiteList().keySet()) {
            Pattern pattern = Pattern.compile(patternKey);
            Matcher matcher = pattern.matcher(reqKey);
            if (matcher.matches()) {
                return patternKey;
            }
        }
        return null; // No matching pattern was found.
    }

    private boolean containsWhiteListUrl(String patternKeyUrlWhiteList){
        var urlWhiteListEnabled = this.accessConfig.getUrlWhiteList().get(patternKeyUrlWhiteList);
        if (urlWhiteListEnabled != null && urlWhiteListEnabled)
            return true;
        return false;
    }

    private boolean containsUrlToValidate(String patternKeyUrlToValidate){
        if (patternKeyUrlToValidate != null && this.accessConfig.getUrlToValidate().containsKey(patternKeyUrlToValidate))
            return true;
        return false;
    }

    private void verifyToken(AuthEndpointDto verifyDto) {
        if (verifyDto.getAccessToken().contains(JWT_BEARER_PREFIX))
            verifyDto.setAccessToken(verifyDto.getAccessToken().replace(JWT_BEARER_PREFIX, ""));
        log.info("getAccessToken: {}", verifyDto.getAccessToken());
        if (!jwtService.isValid(verifyDto.getAccessToken()))
            throw new UnauthorizedException("Invalid or expired access");
    }

    private String getVerifyUrlPath(AuthEndpointDto verifyDto){
        String path = "";
        try {
            URI uri = new URI(verifyDto.getUrl());
            path = uri.getPath();
        } catch (URISyntaxException e) {
            throw new UnauthorizedException("Invalid URL for access", e);
        }
        return path;
    }

    private String urlToValidateAuth(AuthEndpointDto verifyDto, String patternKeyUrlToValidate){
        verifyToken(verifyDto);
        log.info("urlToValidateAuth.patternKeyUrlToValidate: {}", patternKeyUrlToValidate);
        UrlAccess urlAccess = this.accessConfig.getUrlToValidate().get(patternKeyUrlToValidate);
        if (!urlAccess.getEnabled())
            throw new UnauthorizedException("Invalid access URL is disabled");
        Claims claims = jwtService.extractClaims(verifyDto.getAccessToken());
        log.info("claims: {}", claims);
        if (urlAccess.getRequireCustomerId()) {
            String customerId = claims.get("customerId", String.class);
            if (customerId == null || !customerId.equals(verifyDto.getCustomerId()))
                throw new UnauthorizedException("Invalid access from customer");
        }
        String profile = claims.get("profile", String.class);
        List<String> allowProfiles = urlAccess.getAllowProfiles().stream()
            .map(Enum::name)
            .collect(Collectors.toList());
        if (urlAccess.getAllowAllProfiles()) {
            return "ACCESS_ALLOWED_ALL_PROFILES";
        } else if (allowProfiles.contains(profile)) {
            return "ACCESS_ALLOWED_BY_PROFILE";
        } else {
            throw new UnauthorizedException("Invalid access from profile");
        }
    }

}
