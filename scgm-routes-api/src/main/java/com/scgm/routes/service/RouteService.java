package com.scgm.routes.service;

import java.util.Optional;

import com.scgm.routes.dto.RouteAddDto;
import com.scgm.routes.dto.RouteDto;
import com.scgm.routes.dto.RouteUpdateDto;

public interface RouteService {

    public RouteDto add(RouteAddDto routeAdd);

    public Optional<RouteDto> findById(String id);

    public RouteDto update(String routeId, RouteUpdateDto routeUpdate);

    public void delete(String routeId);

}