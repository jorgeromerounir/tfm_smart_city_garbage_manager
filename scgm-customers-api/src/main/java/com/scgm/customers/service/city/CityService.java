package com.scgm.customers.service.city;

import java.util.List;
import java.util.Optional;

import com.scgm.customers.dto.city.CityAddDto;
import com.scgm.customers.dto.city.CityDto;
import com.scgm.customers.dto.city.CityUpdateDto;
import com.scgm.customers.dto.city.CountryDto;

public interface CityService {

    public CityDto add(CityAddDto cityAddDto);

    public Optional<CityDto> findById(Long id);

    public List<CityDto> findByNameContaining(String name);

    public List<CityDto> findByCountry(String country);

    public List<CityDto> findAll();

    public CityDto update(Long cityId, CityUpdateDto cityUpdateDto);

    public void delete(Long customerId);

    public List<CountryDto> getCountries();

}
