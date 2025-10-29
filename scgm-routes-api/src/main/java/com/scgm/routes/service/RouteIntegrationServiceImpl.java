package com.scgm.routes.service;

import com.scgm.routes.client.container.ContainerClient;
import com.scgm.routes.dto.*;
import com.scgm.routes.dto.container.ContainerDto;
import com.scgm.routes.entity.WasteLevel;
import com.scgm.routes.exceptions.RouteLogicException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class RouteIntegrationServiceImpl implements RouteIntegrationService {

    //The value 0 means that there is no limit to the number of containers in the list.
    private static final Integer LIMIT_CONTAINERS_REQ = 0;

    private final ContainerClient containerClient;
    private final TruckService truckService;

    @Override
    public OptimizedRouteResponse optimizeRoute(Long customerId, OptimizeRouteDto data) {
        log.info("Optimizing route for customerId:{}  city: {}", customerId, data.getCityId());
        List<ContainerDto> containers = getFilteredContainers(customerId, data);
        if (containers.isEmpty()) {
            throw new RouteLogicException("No containers found for given criteria");
        }
        Point depot = new Point(data.getStartLat(), data.getStartLng());
        List<TruckDto> trucks = getAvailableTrucks(customerId, data.getCityId());
        VRPSolution vrpSolution = solveVRP(depot, containers, trucks);
        return OptimizedRouteResponse.builder()
                .routes(vrpSolution.getRoutes())
                .totalDistance(vrpSolution.getTotalDistance())
                .containerCount(containers.size())
                .estimatedTime(vrpSolution.getEstimatedTime())
                .trucksUsed(vrpSolution.getTrucksUsed())
                .build();
    }

    @Override
    public RouteAssignmentDto assignRoute(RouteAssignmentDto data) {
        log.info("Assigning route: {}", data.getRouteName());
        data.setStatus(AssignmentStatus.PENDING);
        // TODO: Implement database persistence
        return data;
    }

    @Override
    public List<RouteAssignmentDto> getAssignments(String operatorId) {
        log.info("Getting assignments for operator: {}", operatorId);
        // TODO: Implement database query
        return new ArrayList<>();
    }

    @Override
    public RouteAssignmentDto updateAssignmentStatus(String id, AssignmentStatus status) {
        log.info("Updating assignment {} to status: {}", id, status);
        // TODO: Implement database update
        return null;
    }

    private List<ContainerDto> getFilteredContainers(Long customerId, OptimizeRouteDto data) {
        //CityBounds bounds = getCityBounds(data.getCityId());
        // TODO: Use ContainerClient to get filtered containers
        // For now, return empty list
        log.info("Tryon to get contianers customerId: {} OptimizeRoute: {}", customerId, data);
        return this.containerClient.findByCustomerIdAndCityIdAndBounds(customerId, data.getCityId(),
            data.getStartLat(), data.getEndLat(), data.getStartLng(), data.getEndLng(), 0);
    }

    /*
    private double minLat;
        private double maxLat;
        private double minLng;
        private double maxLng;
        */
    /*private CityBounds getCityBounds(Long cityId) {
        Map<Long, CityBounds> bounds = Map.of(
            1L, new CityBounds(4.597, 4.76, -74.147, -74.047),
            6L, new CityBounds(40.39, 40.47, -3.75, -3.65)
        );
        return bounds.getOrDefault(cityId, bounds.get(cityId));
    }*/

    private List<TruckDto> getAvailableTrucks(Long customerId, Long cityId) {
        return truckService.findByCustomerCityAndAvailable(customerId, cityId, true);
    }

    private VRPSolution solveVRP(Point depot, List<ContainerDto> containers, List<TruckDto> trucks) {
        if (containers.isEmpty()) {
            return VRPSolution.builder()
                    .routes(new ArrayList<>())
                    .totalDistance(0.0)
                    .estimatedTime(0)
                    .trucksUsed(0)
                    .build();
        }

        List<Point> points = containers.stream()
                .map(c -> Point.builder()
                        .lat(c.getLatitude())
                        .lng(c.getLongitude())
                        .id(c.getId())
                        .priority(getPriority(c.getWasteLevelStatus()))
                        .build())
                .collect(Collectors.toList());

        List<Point> sortedPoints = sweepSort(depot, points);
        List<OptimizedRouteResponse.RouteResult> routes = partitionIntoRoutes(depot, sortedPoints, trucks);
        List<OptimizedRouteResponse.RouteResult> optimizedRoutes = routes.stream()
                .map(this::dijkstraOptimize)
                .collect(Collectors.toList());

        double totalDistance = optimizedRoutes.stream()
                .mapToDouble(route -> calculateTotalDistance(route.getPoints()))
                .sum();

        return VRPSolution.builder()
                .routes(optimizedRoutes)
                .totalDistance(Math.round(totalDistance * 100.0) / 100.0)
                .estimatedTime((int) Math.round((totalDistance / 30) * 60))
                .trucksUsed(optimizedRoutes.size())
                .build();
    }

    private int getPriority(WasteLevel wasteLevel) {
        return switch (wasteLevel) {
            case HEAVY -> 3;
            case MEDIUM -> 2;
            case LIGHT -> 1;
        };
    }

    private List<Point> sweepSort(Point depot, List<Point> points) {
        return points.stream()
                .sorted((a, b) -> {
                    double angleA = Math.atan2(a.getLat() - depot.getLat(), a.getLng() - depot.getLng());
                    double angleB = Math.atan2(b.getLat() - depot.getLat(), b.getLng() - depot.getLng());
                    return Double.compare(angleA, angleB);
                })
                .collect(Collectors.toList());
    }

    private List<OptimizedRouteResponse.RouteResult> partitionIntoRoutes(Point depot, List<Point> points, List<TruckDto> trucks) {
        List<OptimizedRouteResponse.RouteResult> routes = new ArrayList<>();
        int maxPointsPerTruck = (int) Math.ceil((double) points.size() / trucks.size());

        for (int i = 0; i < trucks.size() && i * maxPointsPerTruck < points.size(); i++) {
            int start = i * maxPointsPerTruck;
            int end = Math.min(start + maxPointsPerTruck, points.size());
            List<Point> routePoints = new ArrayList<>();
            routePoints.add(depot);
            routePoints.addAll(points.subList(start, end));
            routePoints.add(depot);

            routes.add(OptimizedRouteResponse.RouteResult.builder()
                    .truckId(trucks.get(i).getId())
                    .truckName(trucks.get(i).getName())
                    .points(routePoints)
                    .build());
        }

        return routes;
    }

    private OptimizedRouteResponse.RouteResult dijkstraOptimize(OptimizedRouteResponse.RouteResult route) {
        List<Point> points = route.getPoints();
        if (points.size() <= 3) return route;

        List<Point> optimized = new ArrayList<>();
        optimized.add(points.get(0)); // start depot
        List<Point> unvisited = new ArrayList<>(points.subList(1, points.size() - 1));
        Point current = points.get(0);

        while (!unvisited.isEmpty()) {
            Point nearest = findNearest(current, unvisited);
            unvisited.remove(nearest);
            optimized.add(nearest);
            current = nearest;
        }

        optimized.add(points.get(points.size() - 1)); // end depot

        return OptimizedRouteResponse.RouteResult.builder()
                .truckId(route.getTruckId())
                .truckName(route.getTruckName())
                .points(optimized)
                .build();
    }

    private Point findNearest(Point current, List<Point> points) {
        return points.stream()
                .min((a, b) -> Double.compare(
                        calculateDistance(current, a),
                        calculateDistance(current, b)))
                .orElse(current);
    }

    private double calculateDistance(Point p1, Point p2) {
        final double R = 6371; // Earth's radius in km
        double dLat = toRad(p2.getLat() - p1.getLat());
        double dLng = toRad(p2.getLng() - p1.getLng());
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(p1.getLat())) * Math.cos(toRad(p2.getLat())) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private double toRad(double deg) {
        return deg * (Math.PI / 180);
    }

    private double calculateTotalDistance(List<Point> route) {
        double total = 0;
        for (int i = 0; i < route.size() - 1; i++) {
            total += calculateDistance(route.get(i), route.get(i + 1));
        }
        return Math.round(total * 100.0) / 100.0;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class VRPSolution {
        private List<OptimizedRouteResponse.RouteResult> routes;
        private double totalDistance;
        private int estimatedTime;
        private int trucksUsed;
    }
}
