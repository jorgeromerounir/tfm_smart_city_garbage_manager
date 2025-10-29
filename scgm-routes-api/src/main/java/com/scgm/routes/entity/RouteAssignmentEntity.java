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

@Document(collection = "route_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteAssignmentEntity {

    public static final Pattern INJECTION_PATTERN = Pattern.compile(
        "^[\\p{L}0-9\\s.,!?#@_'-]*$",
        Pattern.UNICODE_CHARACTER_CLASS
    );

    public static final Pattern UUID_PATTERN = Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    @Id
    private String id;
    
    @Field("route_name")
    private String routeName; //required
    
    @Field("status")
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.UNASSIGNED; //required
    
    @Field("route_data")
    private String routeData; //required

    @Field("city_id")
    private Long cityId; //required

    @Field("customer_id")
    private Long customerId; //required

    @Field("supervisor_id")
    private String supervisorId; // required
    
    @Field("truck_id")
    private String truckId;
    
    @Field("operator_id")
    private String operatorId;

    @Field("scheduled_date")
    private LocalDate scheduledDate;
    
    @Field("created_at")
    private Instant createdAt; //required
    
    @Field("updated_at")
    private Instant updatedAt; //required

    @Field("notes")
    private String notes;

    public enum AssignmentStatus {
        UNASSIGNED, //Se acaba de crear, default value 
        PENDING, //Operator set, but not init
        IN_PROGRESS, // Operator ejecutando la ruta
        COMPLETED,
        CANCELLED
    }

    public List<String> validate() {
        List<String> listErrors = new ArrayList<>();
        if (!StringUtils.isEmpty(getId()) && !UUID_PATTERN.matcher(getId()).matches())
            listErrors.add("id: invalid UUID format");
        
        if (StringUtils.isEmpty(getRouteName())) {
            listErrors.add("routeName: is required");
        } else if (!INJECTION_PATTERN.matcher(getRouteName()).matches()) {
            listErrors.add("routeName: invalid format");
        }

        if (StringUtils.isEmpty(getRouteData())) {
            listErrors.add("routeData: is required");
        } else if (!INJECTION_PATTERN.matcher(getRouteData()).matches()) {
            listErrors.add("routeData: invalid format");
        }

        if (!StringUtils.isEmpty(getTruckId()) && !INJECTION_PATTERN.matcher(getTruckId()).matches()) {
            listErrors.add("truckId: invalid format");
        }
        if (StringUtils.isEmpty(getOperatorId())) {
            listErrors.add("operatorId: is required");
        } else if (!INJECTION_PATTERN.matcher(getOperatorId()).matches()) {
            listErrors.add("operatorId: invalid format");
        }
        if (StringUtils.isEmpty(getSupervisorId())) {
            listErrors.add("supervisorId: is required");
        } else if (!INJECTION_PATTERN.matcher(getSupervisorId()).matches()) {
            listErrors.add("supervisorId: invalid format");
        }
        if (getCityId() == null)
            listErrors.add("cityId: is required");
        if (getCustomerId() == null)
            listErrors.add("customerId: is required");
        if (getStatus() == null)
            listErrors.add("status: is required");
        if (getCreatedAt() == null)
            listErrors.add("createdAt: is required");
        if (getUpdatedAt() == null)
            listErrors.add("updatedAt: is required");
        return listErrors;
    }

}
