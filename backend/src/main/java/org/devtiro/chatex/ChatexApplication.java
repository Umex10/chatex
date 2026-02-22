package org.devtiro.chatex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Chatex application.
 * This class serves as the entry point for the Spring Boot application.
 */
@SpringBootApplication
public class ChatexApplication {

    /**
     * Main entry point that bootstraps and launches the Spring Boot application.
     */
    public static void main(String[] args) {
        SpringApplication.run(ChatexApplication.class, args);
    }

}
