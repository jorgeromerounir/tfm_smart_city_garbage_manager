package com.scgm.customers.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.scgm.customers.entity.city.CityEntity;

import jakarta.persistence.*;
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
@Table(name = "customers")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customers_seq_gen")
    @SequenceGenerator(name = "customers_seq_gen", sequenceName = "customers_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", referencedColumnName = "id", nullable = false)
    private CityEntity city;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "active", nullable = false)
    private Boolean active;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (StringUtils.isEmpty(getName()))
            listErrors.add("name: cannot be empty");
        if (!StringUtils.isEmpty(getName()) && getName().length() > 200) {
            listErrors.add("name: must not exceed 200 characters");
        } else if (!StringUtils.isEmpty(getName()) && !INJECTION_PATTERN.matcher(name).matches()) {
            listErrors.add("name: invalid format");
        }
        if (description != null && !INJECTION_PATTERN.matcher(description).matches())
            listErrors.add("description: invalid format");
        if (getCity() == null)
            listErrors.add("city: is required");
        if (getCity() != null && !getCity().isValid())
            listErrors.add("city: invalid city entity");
        if (getActive() == null)
            listErrors.add("active: is required");
        return listErrors;
    }

}
