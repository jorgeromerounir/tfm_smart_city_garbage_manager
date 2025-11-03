package com.scgm.routes.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.apache.commons.lang3.StringUtils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "trucks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(name = "licensePlate_customer_unique", 
               def = "{'license_plate' : 1, 'customer_id': 1}", 
               unique = true)
public class TruckEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    public static final Pattern ID_PATTERN = Pattern.compile("^[0-9a-fA-F]{24}$");

    public static final Pattern LICENSE_PLATE_PATTERN = Pattern.compile("^[A-Z0-9\\-\\s]{3,15}$");

    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("license_plate")
    private String licensePlate;
    
    @Field("capacity")
    private BigDecimal capacity;
    
    @Field("city_id")
    private Long cityId;
    
    @Field("customer_id")
    private Long customerId;
    
    @Field("available")
    @Builder.Default
    private Boolean available = true;
    
    @Field("created_at")
    private Instant createdAt;
    
    @Field("updated_at")
    private Instant updatedAt;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (!StringUtils.isEmpty(getId()) && !ID_PATTERN.matcher(getId()).matches()) {
            listErrors.add("id: invalid UUID format");
        }
        if (StringUtils.isEmpty(getName())) {
            listErrors.add("name: is required");
        } else if (!INJECTION_PATTERN.matcher(name).matches()) {
            listErrors.add("name: invalid format");
        }
        if (StringUtils.isEmpty(getLicensePlate())) {
            listErrors.add("licensePlate: is required");
        } else if (!LICENSE_PLATE_PATTERN.matcher(getLicensePlate()).matches()) {
            listErrors.add("licensePlate: invalid format");
        }
        if (getCapacity() == null) {
            listErrors.add("capacity: is required");
        } else if (capacity.compareTo(BigDecimal.ZERO) <= 0) {
            listErrors.add("capacity: must be greater than zero");
        }
        if (getCityId() == null)
            listErrors.add("cityId: is required");
        if (getCustomerId() == null)
            listErrors.add("customerId: is required");
        if (getAvailable() == null)
            listErrors.add("available: is required");
        if (getCreatedAt() == null)
            listErrors.add("createdAt: is required");
        if (getUpdatedAt() == null)
            listErrors.add("updatedAt: is required");
        return listErrors;
    }

}