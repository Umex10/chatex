package org.devtiro.chatex.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for the application.
 * Reads the allowed frontend origin from the environment variable FRONTEND_URL.
 * Falls back to http://localhost:3000 when running locally.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Reads the frontend URL from the Railway environment variable.
    // Falls back to localhost for local development.
    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                                              // Apply CORS to all endpoints
                .allowedOrigins(frontendUrl)                                    // Only allow the configured frontend origin
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);                                        // Required for JWT cookies
    }
}
