package com.scgm.customers.entity.customer;

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

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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

    /**
     * ISO 3166-1 alpha-2
     */
    public static final List<String> ISO_COUNTRY_CODES = List.of(
        "AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
        "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BR", "IO",
        "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX",
        "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO",
        "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "GA",
        "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
        "HT", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM",
        "JP", "JE", "JO", "KZ", "KE", "KI", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY",
        "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU",
        "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC",
        "NZ", "NI", "NE", "NG", "NU", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY",
        "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RE", "RO", "RU", "RW", "BL", "SH", "KN",
        "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK",
        "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH",
        "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV",
        "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE", "VN", "VI", "WF", "EH", "YE",
        "ZM", "ZW"
    );

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "country")
    private String country;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (getId() == null) {
            listErrors.add("id: is required");
        }
        if (StringUtils.isEmpty(getName())) {
            listErrors.add("name: cannot be empty");
        }
        if (StringUtils.isEmpty(getCountry())) {
            listErrors.add("country: cannot be empty");
        } else if (!ISO_COUNTRY_CODES.contains(getCountry().toUpperCase())) {
            listErrors.add("country: must be a valid ISO 3166-1 alpha-2 code");
        }
        if (getLatitude() == null) {
            listErrors.add("latitude: is required");
        }
        if (getLongitude() == null) {
            listErrors.add("longitude: is required");
        }
        if (getActive() == null) {
            listErrors.add("active: is required");
        }
        return listErrors;
    }

    public boolean isValid() {
        List<String> errorList = validate();
        return errorList.isEmpty();
    }
}
