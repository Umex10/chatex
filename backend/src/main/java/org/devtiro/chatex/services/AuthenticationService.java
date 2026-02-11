package org.devtiro.chatex.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.devtiro.chatex.domain.TkExpiry;
import org.devtiro.chatex.domain.dtos.responses.AuthAccountResponseDto;
import org.devtiro.chatex.domain.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {

    UserDetails authenticate(String username, String key);

    AuthAccountResponseDto createAuthAccountResponseDto(String username, HttpServletResponse response);

    String createTk(String username, TkExpiry tkExpiry);

    UserDetails validateTk(String tk);

    String extractTk(HttpServletRequest request);

}
