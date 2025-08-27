package com.scgm.customers.entity.customer;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import org.apache.commons.lang.StringUtils;
import java.util.ArrayList;
import java.util.List;
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

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "name", length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", referencedColumnName = "id")
    private CityEntity city;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "active")
    private Boolean active;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (getId() == null) {
            listErrors.add("id: is required");
        }
        if (StringUtils.isEmpty(getName())) {
            listErrors.add("name: cannot be empty");
        }
        if (getName() != null && getName().length() > 200) {
            listErrors.add("name: must not exceed 200 characters");
        }
        if (getCity() == null) {
            listErrors.add("city: is required");
        }
        if (getCity() != null && !getCity().isValid()) {
            listErrors.add("city: invalid city entity");
        }
        if (getActive() == null) {
            listErrors.add("active: is required");
        }
        return listErrors;
    }
}