FROM maven:3.9.6-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package

FROM openjdk:21
EXPOSE 8182
COPY --from=build /target/scgm-customers-api*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]