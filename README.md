# tfm_smart_city_garbage_manager
 aplicación web Open Source para la gestión en tiempo real de contenedores de basura en ciudades inteligentes (Smart City). La plataforma permitirá a las entidades u operarios de recogida de residuos visualizar el estado de los contenedores (nivel de basura: carga leve, media o gran carga) a través de un mapa interactivo basado en OpenStreetMap.

## scgm, SCGM = smart city garbage manager

**[scgm-routes-api docs](http://localhost:8180/swagger-ui/index.html#/)**

```shell
##java 21
export JAVA_HOME='C:\Program Files\Java\openjdk-21.0.2'

mvn clean install -Dmaven.test.skip=true -f pom.xml

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
```

Levantar el servicio:
```shell
docker-compose up -d scgm-rabbitmq
```

Detener el servicio:
```shell
docker-compose stop scgm-rabbitmq
```

Levantar el servicio:
```shell
docker-compose up -d scgm_routes_db
```

Detener el servicio:
```shell
docker-compose stop scgm_routes_db
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
