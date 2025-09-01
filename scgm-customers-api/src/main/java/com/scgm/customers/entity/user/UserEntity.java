package com.scgm.customers.entity.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Entity
@Table(name = "users")
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Slf4j
public class UserEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s.,!?#@_'-]*$");
    
    public static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$");

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
    @SequenceGenerator(name = "users_seq_gen", sequenceName = "users_seq", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @Column(name = "email", length = 200, nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile", length = 50, nullable = false)
    private Profile profile;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        //name validations
        if (StringUtils.isBlank(name)) {
            listErrors.add("name: cannot be empty");
        } else if (name.length() > 200) {
            listErrors.add("name: must not exceed 200 characters");
        } else if (!INJECTION_PATTERN.matcher(name).matches()) {
            listErrors.add("name: invalid format");
        }
        //email validations
        if (StringUtils.isBlank(email)) {
            listErrors.add("email: cannot be empty");
        } else if (!EMAIL_PATTERN.matcher(email).matches()) {
            listErrors.add("email: invalid format");
        }

        if (profile == null)
            listErrors.add("profile: is required");
        
        if (customerId == null)
            listErrors.add("customerId: is required");
        
        return listErrors;
    }
}
