package com.scgm.containers.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import org.apache.commons.lang.StringUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.time.Instant;

@Entity
@Table(name = "containers")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    public static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "waste_level_value", nullable = false)
    private Double wasteLevelValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_level_status", length = 50, nullable = false)
    private WasteLevel wasteLevelStatus;

    @Column(name = "temperature", nullable = false)
    private Double temperature;

    @Column(name = "address", columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "city_id", nullable = false)
    private Long cityId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum WasteLevel {
        LIGHT,
        MEDIUM,
        HEAVY
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(id)) {
            listErrors.add("id: is required");
        } else if (!UUID_PATTERN.matcher(id).matches()) {
            listErrors.add("id: invalid UUID format");
        }
        if (latitude == null)
            listErrors.add("latitude: is required");
        else if (latitude < -90.0 || latitude > 90.0)
            listErrors.add("latitude: must be between -90 and 90");
        if (longitude == null)
            listErrors.add("longitude: is required");
        else if (longitude < -180.0 || longitude > 180.0)
            listErrors.add("longitude: must be between -180 and 180");
        if (wasteLevelStatus == null)
            listErrors.add("wasteLevelStatus: is required");
        if (temperature == null)
            listErrors.add("temperature: is required");
        else if (temperature < 0.0 || temperature > 70.0)
            listErrors.add("temperature: must be between 0 and 70 degrees");
        if (StringUtils.isEmpty(address)) {
            listErrors.add("address: is required");
        } else if (address != null && !INJECTION_PATTERN.matcher(address).matches()) {
            listErrors.add("address: invalid format");
        }
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        if (createdAt == null)
            listErrors.add("createdAt: is required");
        if (updatedAt == null)
            listErrors.add("updatedAt: is required");
        return listErrors;
    }
}
