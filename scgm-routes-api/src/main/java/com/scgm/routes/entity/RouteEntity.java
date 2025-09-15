package com.scgm.routes.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import org.apache.commons.lang3.StringUtils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    public static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    @Id
    private String id;
    
    @Field("scheduled_date")
    private LocalDate scheduledDate;
    
    @Field("route_status")
    private RouteStatus routeStatus;
    
    @Field("city_id")
    private Long cityId;
    
    @Field("customer_id")
    private Long customerId;
    
    @Field("created_at")
    private Instant createdAt;
    
    @Field("updated_at")
    private Instant updatedAt;
    
    @Field("notes")
    private String notes;

    public enum RouteStatus {
        IN_PROGRESS,
        AVIALABLE,
        CANCELLED,
        COMPLETED
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(id)) {
            listErrors.add("id: is required");
        } else if (!UUID_PATTERN.matcher(id).matches()) {
            listErrors.add("id: invalid UUID format");
        }
        if (scheduledDate == null)
            listErrors.add("scheduledDate: is required");
        if (routeStatus == null)
            listErrors.add("routeStatus: is required");
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        if (notes != null && !StringUtils.isEmpty(notes) && !INJECTION_PATTERN.matcher(notes).matches()) {
            listErrors.add("notes: invalid format");
        }
        if (createdAt == null)
            listErrors.add("createdAt: is required");
        if (updatedAt == null)
            listErrors.add("updatedAt: is required");
        return listErrors;
    }

}