package com.scgm.customers.service.city;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scgm.customers.dto.city.CityAddDto;
import com.scgm.customers.dto.city.CityDto;
import com.scgm.customers.dto.city.CityUpdateDto;
import com.scgm.customers.entity.city.CityEntity;
import com.scgm.customers.exceptions.CustomerDatabaseException;
import com.scgm.customers.exceptions.city.CityNotFoundException;
import com.scgm.customers.exceptions.city.CityValidationException;
import com.scgm.customers.repository.city.CityRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    @Override
    public CityDto add(CityAddDto cityAdd) {
        var reqListErrors = cityAdd.validate();
        if (!reqListErrors.isEmpty())
            throw new CityValidationException("Trying to add: error city request validation.", reqListErrors);
        var cityEntity = CityAddDto.toEntity(cityAdd);
        var listErrors = cityEntity.validate();
        if (!listErrors.isEmpty())
            throw new CityValidationException("Trying to add: error city entity validation.", listErrors);
        try {
            return CityDto.toDto(cityRepository.save(cityEntity));
        } catch (Exception e) {
            log.error("Error trying to add city with name: {}", cityEntity.getName(), e);
            throw new CustomerDatabaseException("Error trying to add city", e);
        }
    }

    @Override
    public Optional<CityDto> findById(Long id) {
        return cityRepository.findById(id)
                .map(CityDto::toDto);
    }

    @Override
    public List<CityDto> findByNameContaining(String name) {
        List<CityEntity> cities = cityRepository.findByNameContaining(name);
        return cities.stream()
                .map(CityDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CityDto> findByCountry(String country) {
        return cityRepository.findByCountry(country).stream()
                .map(CityDto::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CityDto update(Long cityId, CityUpdateDto cityUpdate) {
        var reqListErrors = cityUpdate.validate();
        if (!reqListErrors.isEmpty())
            throw new CityValidationException("Trying to update: error city request validation.", reqListErrors);
        var cityOpt = cityRepository.findById(cityId);
        cityOpt.orElseThrow(() -> new CityNotFoundException(cityId));
        CityEntity existingCity = cityOpt.get();
        existingCity.setName(cityUpdate.getName());
        existingCity.setCountry(cityUpdate.getCountry());
        existingCity.setLatitude(cityUpdate.getLatitude());
        existingCity.setLongitude(cityUpdate.getLongitude());
        existingCity.setActive(cityUpdate.getActive());
        existingCity.setUpdatedAt(Instant.now());
        var listErrors = existingCity.validate();
        if (!listErrors.isEmpty())
            throw new CityValidationException("Trying to update: error city entity validation.", listErrors);
        try {
            return CityDto.toDto(cityRepository.save(existingCity));
        } catch (Exception e) {
            log.error("Error trying to update city with ID: {}", existingCity.getId(), e);
            throw new CustomerDatabaseException("Error trying to update city", e);
        }
    }

    @Override
    @Transactional
    public void delete(Long cityId) {
        if (!cityRepository.existsById(cityId)) {
            throw new CityNotFoundException(cityId);
        }
        try {
            cityRepository.deleteById(cityId);
            log.debug("City with ID: {} deleted successfully.", cityId);
        } catch (Exception e) {
            log.error("Error trying to delete city with ID: {}", cityId, e);
            throw new CustomerDatabaseException("Error trying to delete city", e);
        }
    }

}