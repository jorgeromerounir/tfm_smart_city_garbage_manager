package com.scgm.containers.util;

import java.util.UUID;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang.StringUtils;

@UtilityClass
public class UuidUtil {

    public static String generateUuidAsString() {
        return UUID.randomUUID().toString();
    }

    public static boolean isValidUuid(String uuidString) {
        if (StringUtils.isBlank(uuidString)) {
            return false;
        }
        try {
            UUID.fromString(uuidString);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}