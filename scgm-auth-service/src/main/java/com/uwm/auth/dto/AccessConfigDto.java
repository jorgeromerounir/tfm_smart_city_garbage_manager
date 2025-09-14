package com.uwm.auth.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessConfigDto {

    public static final Pattern URL_FORMAT_PATTERN = Pattern.compile("^(GET|POST|PUT|DELETE|PATCH)::/.*$");

    private Map<String, Boolean> urlWhiteList;
    private Map<String, UrlAccess> urlToValidate;

    public enum Profile {
        ADMIN,
        SUPERVISOR,
        OPERATOR
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UrlAccess {
        private List<Profile> allowProfiles;
        private Boolean allowAllProfiles;
        private Boolean enabled;
        private Boolean requireCustomerId;
    }

    public List<String> validate() {
        List<String> errorList = new ArrayList<>();
        if (urlWhiteList == null) {
            errorList.add("urlWhiteList: is required");
        } else {
            for (String key : urlWhiteList.keySet()) {
                if (!URL_FORMAT_PATTERN.matcher(key).matches()) {
                    errorList.add("urlWhiteList invalid key format: " + key);
                }
            }
        }
        if (urlToValidate == null) {
            errorList.add("urlToValidate: is required");
        } else {
            for (String key : urlToValidate.keySet()) {
                if (!URL_FORMAT_PATTERN.matcher(key).matches()) {
                    errorList.add("urlToValidate invalid key format: " + key);
                }
            }
        }
        return errorList;
    }

}