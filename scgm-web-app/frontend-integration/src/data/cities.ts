export interface CityOption {
  name: string
  country: string
  latitude: number
  longitude: number
}

export const AVAILABLE_CITIES: CityOption[] = [
  // North America
  { name: 'New York', country: 'US', latitude: 40.7128, longitude: -74.006 },
  { name: 'Los Angeles', country: 'US', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Chicago', country: 'US', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Toronto', country: 'CA', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Mexico City', country: 'MX', latitude: 19.4326, longitude: -99.1332 },
  // South America
  { name: 'Bogotá D.C.', country: 'CO', latitude: 4.711, longitude: -74.0721 },
  { name: 'Medellín', country: 'CO', latitude: 6.2442, longitude: -75.5812 },
  { name: 'São Paulo', country: 'BR', latitude: -23.5505, longitude: -46.6333 },
  { name: 'Buenos Aires', country: 'AR', latitude: -34.6118, longitude: -58.396 },
  { name: 'Lima', country: 'PE', latitude: -12.0464, longitude: -77.0428 },
  // Europe
  { name: 'Madrid', country: 'ES', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Barcelona', country: 'ES', latitude: 41.3851, longitude: 2.1734 },
  { name: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522 },
  { name: 'London', country: 'GB', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Berlin', country: 'DE', latitude: 52.52, longitude: 13.405 },
  { name: 'Rome', country: 'IT', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Amsterdam', country: 'NL', latitude: 52.3676, longitude: 4.9041 },
  { name: 'Vienna', country: 'AT', latitude: 48.2082, longitude: 16.3738 },
  { name: 'Stockholm', country: 'SE', latitude: 59.3293, longitude: 18.0686 },
  { name: 'Lisbon', country: 'PT', latitude: 38.7223, longitude: -9.1393 }
]
