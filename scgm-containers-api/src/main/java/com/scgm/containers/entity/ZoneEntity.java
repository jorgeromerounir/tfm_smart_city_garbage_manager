package com.scgm.containers.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "zones")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZoneEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    public static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    public static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "center_latitude", nullable = false)
    private Double centerLatitude;

    @Column(name = "center_longitude", nullable = false)
    private Double centerLongitude;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "city_id", nullable = false)
    private Long cityId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "start_lat", nullable = false)
    private Double startLat;

    @Column(name = "start_lng", nullable = false)
    private Double startLng;

    @Column(name = "end_lat", nullable = false)
    private Double endLat;

    @Column(name = "end_lng", nullable = false)
    private Double endLng;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "color", length = 7, nullable = false)
    private String color;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(id)) {
            listErrors.add("id: is required");
        } else if (!UUID_PATTERN.matcher(id).matches()) {
            listErrors.add("id: invalid UUID format");
        }
        if (centerLatitude == null)
            listErrors.add("centerLatitude: is required");
        else if (centerLatitude < -90.0 || centerLatitude > 90.0)
            listErrors.add("centerLatitude: must be between -90 and 90");
        if (centerLongitude == null)
            listErrors.add("centerLongitude: is required");
        else if (centerLongitude < -180.0 || centerLongitude > 180.0)
            listErrors.add("centerLongitude: must be between -180 and 180");
        if (StringUtils.isEmpty(name)) {
            listErrors.add("name: is required");
        } else if (!INJECTION_PATTERN.matcher(name).matches()) {
            listErrors.add("name: invalid format");
        }
        if (cityId == null)
            listErrors.add("cityId: is required");
        if (customerId == null)
            listErrors.add("customerId: is required");
        if (startLat == null)
            listErrors.add("startLat: is required");
        else if (startLat < -90.0 || startLat > 90.0)
            listErrors.add("startLat: must be between -90 and 90");
        if (startLng == null)
            listErrors.add("startLng: is required");
        else if (startLng < -180.0 || startLng > 180.0)
            listErrors.add("startLng: must be between -180 and 180");
        if (endLat == null)
            listErrors.add("endLat: is required");
        else if (endLat < -90.0 || endLat > 90.0)
            listErrors.add("endLat: must be between -90 and 90");
        if (endLng == null)
            listErrors.add("endLng: is required");
        else if (endLng < -180.0 || endLng > 180.0)
            listErrors.add("endLng: must be between -180 and 180");
        if (description != null && !INJECTION_PATTERN.matcher(description).matches()) {
            listErrors.add("description: invalid format");
        }
        if (StringUtils.isEmpty(color)) {
            listErrors.add("color: is required");
        } else if (!HEX_COLOR_PATTERN.matcher(color).matches()) {
            listErrors.add("color: must be a valid hexadecimal color format (#RRGGBB)");
        }
        if (createdAt == null)
            listErrors.add("createdAt: is required");
        if (updatedAt == null)
            listErrors.add("updatedAt: is required");
        return listErrors;
    }
}