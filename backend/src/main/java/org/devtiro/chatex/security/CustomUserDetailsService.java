package org.devtiro.chatex.security;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetailsService implementation for loading user-specific data.
 * Integrates with Spring Security's authentication mechanism.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRep userRep;

    /**
     * Loads user details by username for authentication.
     *
     * @return CustomUserDetails containing user information
     * @throws UsernameNotFoundException if user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRep.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with the username: " + username + " doesn't exist."));
        return new CustomUserDetails(user);
    }

}
