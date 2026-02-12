package org.devtiro.chatex.services;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.devtiro.chatex.domain.TkExpiry;
import org.devtiro.chatex.domain.dtos.responses.AuthResponseDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {

    UserDetails authenticate(String username, String key);

    AuthResponseDto createAuthResponseDto(String username,
         HttpServletRequest request, HttpServletResponse response);

    String createTk(String username, TkExpiry tkExpiry);

    UserDetails validateTk(String tk);

    String extractAccesTk(HttpServletRequest request);

    String extractRefreshTk(HttpServletRequest request);

}
