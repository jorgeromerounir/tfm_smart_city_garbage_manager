# tfm_smart_city_garbage_manager
 aplicación web Open Source para la gestión en tiempo real de contenedores de basura en ciudades inteligentes (Smart City). La plataforma permitirá a las entidades u operarios de recogida de residuos visualizar el estado de los contenedores (nivel de basura: carga leve, media o gran carga) a través de un mapa interactivo basado en OpenStreetMap.

## scgm, SCGM = smart city garbage manager

**[scgm-routes-api docs](http://localhost:8180/swagger-ui/index.html#/)**

```shell
##java 21
export JAVA_HOME='C:\Program Files\Java\openjdk-21.0.2'

mvn clean install -Dmaven.test.skip=true -f pom.xml

## For generate/update diagramas
https://www.mermaidchart.com/

mvn clean install -f pom.xml

## to enable connection with Eureka
export EUREKA_ENABLED='true'

'/c/Program Files/Java/openjdk-21.0.2/bin/java' -jar ./target/scgm-eureka-balancer.jar

'/c/Program Files/Java/openjdk-21.0.2/bin/java' -jar ./target/scgm-gateway-public.jar

"$JAVA_HOME/bin/java" -jar ./target/auth-service-1.0.0.jar

## -----> scgm-routes-api run on port: 8180
'/c/Program Files/Java/openjdk-21.0.2/bin/java' -jar ./target/scgm-routes-api.jar

curl -X 'GET' \
  'http://localhost:8180/' \
  -H 'accept: */*'

curl -X 'POST' \
  'http://localhost:8763/scgm-routes-api/' \
  -H 'Content-Type: application/json' \
  -d '{"targetMethod": "GET"}'

## -----> scgm-containers-api run on port: 8181
'/c/Program Files/Java/openjdk-21.0.2/bin/java' -jar ./target/scgm-containers-api.jar

curl -X 'GET' \
  'http://localhost:8181/' \
  -H 'accept: */*'

curl -X 'POST' \
  'http://localhost:8763/scgm-containers-api/' \
  -H 'Content-Type: application/json' \
  -d '{"targetMethod": "GET"}'

## -----> scgm-customers-api run on port: 8182
'/c/Program Files/Java/openjdk-21.0.2/bin/java' -jar ./target/scgm-customers-api.jar

curl -X 'GET' \
  'http://localhost:8182/' \
  -H 'accept: */*'

curl -X 'POST' \
  'http://localhost:8763/scgm-customers-api/' \
  -H 'Content-Type: application/json' \
  -d '{"targetMethod": "GET"}'

```

## Docker compose info

Finalizar y destruir el servicio (elimina contenedor y volúmenes):
```shell
docker-compose down -v
docker compose down -v
```

Levantar todos los servicios:
```shell
docker-compose up -d
docker compose up -d
```

Levantar el servicio rabbitmq:
```shell
docker-compose up -d scgm-rabbitmq
docker compose up -d scgm-rabbitmq
```

Detener el servicio rabbitmq:
```shell
docker-compose stop scgm-rabbitmq
docker compose stop scgm-rabbitmq
```

Levantar el servicio routes_db:
```shell
docker-compose up -d scgm_routes_db
docker compose up -d scgm_routes_db
```

Detener el servicio routes_db:
```shell
docker-compose stop scgm_routes_db
docker compose stop scgm_routes_db
```

```shell
{
  "name": "Scgm Admin",
  "email": "scgm.admin@scgm.com",
  "profile": "ADMIN",
  "customerId": 1,
  "password": "Admin1234"
}
```

```shell
rm -rf node_modules
```


Test signin:
```shell
curl -X 'POST' \
  'http://localhost:8081/auth/signin' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "jorge.test@jorge.com",
    "password": "Admin123"
  }'
```

Test refresh token:
```shell
curl -X 'POST' \
  'http://localhost:8081/auth/refresh' \
  -H 'Content-Type: application/json' \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqb3JnZS50ZXN0QGpvcmdlLmNvbSIsInByb2ZpbGUiOiJBRE1JTiIsImN1c3RvbWVyX2lkIjoiMSIsImlhdCI6MTc1Njg0NDYyMSwiZXhwIjoxNzU3NDQ5NDIxfQ.bGBqbvsO48_0Z1266yJnArOyycH4ZSF3jHuc2WXyEdFSkkwO9lQ6AD2xRQBBjS1aUZbv_5H2uYs4v5dgImIwCA"
  }'

```

```shell
curl -X 'POST' \
  'http://localhost:8081/api/v1/auth/endpoint' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "http://localhost:8763/api/v1/users/by-email",
    "method": "GET",
    "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzY2dtLmFkbWluQHNjZ20uY29tIiwidXBkYXRlZEF0IjoiMjAyNS0wOS0xM1QxODowMTowNy40MDQzNjM2MDBaIiwidXNlcklkIjoiMSIsImN1c3RvbWVySWQiOiIxIiwicHJvZmlsZSI6IkFETUlOIiwiaWF0IjoxNzU3ODYxNjEwLCJleHAiOjE3NTc4NjI1MTB9.ssWlnMT7xXaiPjgqM7m2vGg5gW3Za16BS-v7obB8iSpYhbmcon2pKNm_PDQywHOoS12lWPgHkV9SddEJPBQUpw",
    "accountId": "1",
    "customerId": "1"
  }'
```
