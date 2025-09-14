package com.scgm.customers.controller.city;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scgm.customers.dto.city.CityAddDto;
import com.scgm.customers.dto.city.CityDto;
import com.scgm.customers.dto.city.CityUpdateDto;
import com.scgm.customers.dto.city.CountryDto;
import com.scgm.customers.service.city.CityService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/cities")
@AllArgsConstructor
@Slf4j
public class CityController {

    private final CityService cityService;

    @PostMapping
    public ResponseEntity<CityDto> add(@RequestBody CityAddDto cityAdd) {
        log.debug("Trying to add new city");
        var cityDto = cityService.add(cityAdd);
        return new ResponseEntity<>(cityDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityDto> findById(@PathVariable Long id) {
        log.debug("Finding city with ID: {}", id);
        var cityOpt = cityService.findById(id);
        return cityOpt.map(city -> new ResponseEntity<>(city, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/by-name")
    public ResponseEntity<List<CityDto>> findByNameContaining(@RequestParam String name) {
        log.debug("Finding cities by name containing");
        List<CityDto> cities = cityService.findByNameContaining(name);
        if (cities.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

    @GetMapping("/by-country/{country:[A-Z]{2}}")
    public ResponseEntity<List<CityDto>> findByCountry(@PathVariable String country) {
        log.debug("Finding cities by country");
        List<CityDto> cities = cityService.findByCountry(country);
        if (cities.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

    @PutMapping("/{cityId}")
    public ResponseEntity<CityDto> update(@PathVariable Long cityId, 
        @RequestBody CityUpdateDto cityUpdate) {
        log.debug("Trying to update city with ID: {}", cityId);
        var cityDto = cityService.update(cityId, cityUpdate);
        return new ResponseEntity<>(cityDto, HttpStatus.OK);
    }

    @DeleteMapping("/{cityId}")
    public ResponseEntity<Void> delete(@PathVariable Long cityId) {
        log.debug("Trying to delete city with ID: {}", cityId);
        cityService.delete(cityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/countries")
    public ResponseEntity<List<CountryDto>> getCountries() {
        log.debug("Getting all countries");
        List<CountryDto> countries = cityService.getCountries();
        return new ResponseEntity<>(countries, HttpStatus.OK);
    }

}