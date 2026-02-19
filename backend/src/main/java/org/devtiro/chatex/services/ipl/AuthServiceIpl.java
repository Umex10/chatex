package org.devtiro.chatex.services.ipl;

import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.services.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

/**
 * Implementation of the AuthenticationService interface.
 * Uses Spring Security's AuthenticationManager to validate user credentials.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceIpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    /**
     * Authenticates a user with their credentials.
     * The authentication manager validates the credentials.
     *
     * @return UserDetails of the authenticated user
     */
    // The authentication Manager will tell us if the user credentials
    // are valid
    @Override
    public UserDetails authenticate(String username, String key) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, key));
        // Need to return it, since authentication manager does only the validation
        return userDetailsService.loadUserByUsername(username);
    }

}
