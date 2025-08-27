package com.scgm.containers;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpeApiConfig {

    @Bean
    public OpenAPI customOpenAPI(
        @Value("${spring.application.name}") String appName,
        @Value("${spring.application.description}") String appDescription,
        @Value("${spring.application.version}") String appVersion,
        @Value("${swagger.server.url:http://localhost:8181}") String defaultServerUrl,
        @Value("${swagger.server.gateway.url:http://localhost:8762/scgm-containers-api}") String gatewayServerUrl
    ) {

        final var license = new License()
            .name("Apache 2.0")
            .url("https://www.apache.org/licenses/LICENSE-2.0");

        final var info = new Info()
            .title(appName)
            .description(appDescription)
            .version(appVersion)
            .termsOfService("https://swagger.io/terms/")
            .license(license);

        OpenAPI openAPI = new OpenAPI().info(info);
        // Default server
        openAPI.addServersItem(new Server().url(defaultServerUrl).description("Default Server"));
        // Additional server for gateway
        openAPI.addServersItem(new Server().url(gatewayServerUrl).description("Gateway server"));
        return openAPI;
    }
}
