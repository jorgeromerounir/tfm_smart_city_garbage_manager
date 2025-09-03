package com.scgm.customers.entity.city;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

@Entity
@Table(name = "cities")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityEntity {

    private static final Pattern INJECTION_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s.,!?#@_'-]*$");

    /**
     * ISO 3166-1 alpha-2
     */
    public static final List<String> ISO_COUNTRY_CODES = Country.getAllCountryCodes();

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cities_seq_gen")
    @SequenceGenerator(name = "cities_seq_gen", sequenceName = "cities_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(getName()))
            listErrors.add("name: cannot be empty");
        if (!StringUtils.isEmpty(getName()) && getName().length() > 255) {
            listErrors.add("name: must not exceed 255 characters");
        } else if (!StringUtils.isEmpty(getName()) && !INJECTION_PATTERN.matcher(name).matches()) {
            listErrors.add("name: invalid format");
        }
        //country validations
        if (StringUtils.isEmpty(getCountry())) {
            listErrors.add("country: cannot be empty");
        } else if (!ISO_COUNTRY_CODES.contains(getCountry().toUpperCase())) {
            listErrors.add("country: must be a valid ISO 3166-1 alpha-2 code");
        }
        if (getLatitude() == null)
            listErrors.add("latitude: is required");
        if (getLongitude() == null)
            listErrors.add("longitude: is required");
        if (getActive() == null)
            listErrors.add("active: is required");
        return listErrors;
    }

    public boolean isValid() {
        List<String> errorList = validate();
        return errorList.isEmpty();
    }

}
