package com.scgm.routes.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.routes.dto.RouteAddDto;
import com.scgm.routes.dto.RouteDto;
import com.scgm.routes.dto.RouteUpdateDto;
import com.scgm.routes.entity.RouteEntity;
import com.scgm.routes.util.UuidUtil;
import com.scgm.routes.exceptions.RouteNotFoundException;
import com.scgm.routes.exceptions.RouteValidationException;
import com.scgm.routes.exceptions.RoutesDatabaseException;
import com.scgm.routes.repository.RouteRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;

    @Override
    public RouteDto add(RouteAddDto routeAdd) {
        var reqListErrors = routeAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new RouteValidationException("Trying to add: error route request validation.", reqListErrors);
        var routeEntity = RouteAddDto.toEntity(routeAdd);
        var listErrors = routeEntity.validate();
        if (!listErrors.isEmpty())
            throw new RouteValidationException("Trying to add: error route entity validation.", listErrors);
        try {
            return RouteDto.toDto(routeRepository.save(routeEntity));
        } catch (Exception e) {
            log.error("Error trying to add route with id: {}", routeEntity.getId(), e);
            throw new RoutesDatabaseException("Error trying to add route", e);
        }
    }

    @Override
    public Optional<RouteDto> findById(String id) {
        if(!UuidUtil.isValidUuid(id))
            throw new RouteValidationException("Trying to find by id: invalid id");
        log.debug("Finding route by ID: {}", id);
        try {
            return routeRepository.findById(id).map(RouteDto::toDto);
        } catch (Exception e) {
            log.error("Error trying to find route with ID: {}", id, e);
            throw new RoutesDatabaseException("Error trying to find route", e);
        }
    }

    @Override
    @Transactional
    public RouteDto update(String routeId, RouteUpdateDto routeUpdate) {
        if(!UuidUtil.isValidUuid(routeId))
            throw new RouteValidationException("Trying to find by id: invalid id");
        var reqListErrors = routeUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new RouteValidationException("Trying to update: error route request validation.", reqListErrors);
        var routeOpt = routeRepository.findById(routeId);
        routeOpt.orElseThrow(() -> new RouteNotFoundException(routeId));
        RouteEntity existingRoute = routeOpt.get();
        existingRoute.setScheduledDate(routeUpdate.getScheduledDate());
        existingRoute.setRouteStatus(routeUpdate.getRouteStatus());
        existingRoute.setUpdatedAt(Instant.now());
        if (routeUpdate.getNotes() != null)
            existingRoute.setNotes(routeUpdate.getNotes());
        var listErrors = existingRoute.validate();
        if (!listErrors.isEmpty())
            throw new RouteValidationException("Trying to update: error route entity validation.", listErrors);
        try {
            return RouteDto.toDto(routeRepository.save(existingRoute));
        } catch (Exception e) {
            log.error("Error trying to update route with ID: {}", existingRoute.getId(), e);
            throw new RoutesDatabaseException("Error trying to update route", e);
        }
    }

    @Override
    @Transactional
    public void delete(String routeId) {
        if(!UuidUtil.isValidUuid(routeId))
            throw new RouteValidationException("Trying to find by id: invalid id");
        if (!routeRepository.existsById(routeId))
            throw new RouteNotFoundException(routeId);
        try {
            routeRepository.deleteById(routeId);
            log.debug("Route with ID: {} deleted successfully.", routeId);
        } catch (Exception e) {
            log.error("Error trying to delete route with ID: {}", routeId, e);
            throw new RoutesDatabaseException("Error trying to delete route", e);
        }
    }

}