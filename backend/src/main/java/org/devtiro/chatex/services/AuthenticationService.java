package org.devtiro.chatex.services;

import jakarta.servlet.http.HttpServletRequest;
import org.devtiro.chatex.domain.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {

    UserDetails authenticate(String username, String key);

    String createTk(User user);

    UserDetails validateTk(String tk);

    String extractTk(HttpServletRequest request);

}
