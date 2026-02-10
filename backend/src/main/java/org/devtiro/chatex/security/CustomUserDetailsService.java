package org.devtiro.chatex.security;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRep userRep;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRep.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User with the username: " + username + " doesn't exist."));
        return new CustomUserDetails(user);
    }

}
