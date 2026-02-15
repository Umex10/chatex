package org.devtiro.chatex.security;

import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.entities.User;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Custom implementation of Spring Security's UserDetails interface.
 * Wraps the User entity to provide authentication and authorization
 * information.
 */
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    /**
     * Returns the authorities granted to the user.
     *
     * @return empty list as no roles are currently implemented
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    /**
     * Returns the password used to authenticate the user.
     *
     * @return the user's encrypted password
     */
    @Override
    public @Nullable String getPassword() {
        return user.getKey();
    }

    /**
     * Returns the username used to authenticate the user.
     *
     * @return the username
     */
    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * Indicates whether the user's account has expired.
     *
     * @return true as accounts do not expire
     */
    @Override
    public boolean isAccountNonExpired() {
        // return UserDetails.super.isAccountNonExpired();
        return true;
    }

    /**
     * Indicates whether the user is locked or unlocked.
     *
     * @return true as accounts are not locked
     */
    @Override
    public boolean isAccountNonLocked() {
        // return UserDetails.super.isAccountNonLocked();
        return true;
    }

    /**
     * Indicates whether the user's credentials have expired.
     *
     * @return true as credentials do not expire
     */
    @Override
    public boolean isCredentialsNonExpired() {
        // return UserDetails.super.isCredentialsNonExpired();
        return true;
    }

    /**
     * Indicates whether the user is enabled or disabled.
     *
     * @return true as all users are enabled
     */
    @Override
    public boolean isEnabled() {
        // return UserDetails.super.isEnabled();
        return true;
    }

    /**
     * Retrieves the user's unique identifier.
     *
     * @return the user's UUID
     */
    public UUID getId() {
        return user.getId();
    }
}
