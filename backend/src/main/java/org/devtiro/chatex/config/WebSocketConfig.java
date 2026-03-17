package org.devtiro.chatex.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a memory-based message broker
        // /queue: for private messages (one-to-one)
        config.enableSimpleBroker( "/queue");

        // Prefix for messages bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");

        // Prefix for user-specific destinations (private messaging)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The URL where the client connects to the WebSocket server
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000") // CORS for Next.js
                .withSockJS(); // Fallback option if WebSockets are not available
    }
}