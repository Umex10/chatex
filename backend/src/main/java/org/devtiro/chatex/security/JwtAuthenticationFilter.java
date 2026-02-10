package org.devtiro.chatex.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.devtiro.chatex.services.AuthenticationService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthenticationService authenticationService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String tk = authenticationService.extractTk(request);

            if (tk != null) {
                UserDetails userDetails = authenticationService.validateTk(tk);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                // We need to do this, so that every other filter and controller knows if the
                // current user that issued the request is already authenticated.
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // After this we are able to directly access this attribute to get a user f.e,
                // resulting in less code
                if (userDetails instanceof CustomUserDetails) {
                    request.setAttribute("userId", ((CustomUserDetails) userDetails).getId());
                }
            }
        } catch (Exception ex) {
            log.warn("Received invalid auth token");
        }

        // Calls the next filter in the chain
        filterChain.doFilter(request, response);
    }

}
