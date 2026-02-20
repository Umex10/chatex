package org.devtiro.chatex.services.ipl;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Implementation of the UserService interface.
 * Handles user account creation and retrieval operations with validation.
 */
@Service
@RequiredArgsConstructor
public class UserServiceIpl implements UserService {

    private final UserRep userRep;
    private final PasswordEncoder encoder;

    /**
     * Creates a new user account with validation.
     * Validates uniqueness of username, email, and phone before creating the
     * account.
     * Encodes the user's password before storing.
     *
     * @return the created and persisted User entity
     * @throws EntityExistsException if username, email, or phone already exists
     */
    @Override
    public User createAccount(SignUpAccountRequestDto signUpAccountRequestDto) {

        String username = signUpAccountRequestDto.getUsername();
        String email = signUpAccountRequestDto.getEmail();
        String phone = signUpAccountRequestDto.getPhone();

        // Needed Checks, since these field have to be unique
        if (userRep.existsUserByUsername(username)) {
            throw new EntityExistsException("An user already exists with the username: " + username);
        } else if (userRep.existsUserByEmail(email)) {
            throw new EntityExistsException("An user already exists with the email: " + email);
        } else if (userRep.existsUserByPhone(phone)) {
            throw new EntityExistsException("An user already exists with the phone-number: " + phone);
        }

        // Using our bean from SecurityConfig
        String encodedKey = encoder.encode(signUpAccountRequestDto.getKey());

        User user = User.builder()
                .name(signUpAccountRequestDto.getName())
                .username(username)
                .email(email)
                .phone(phone)
                .key(encodedKey)
                .avatar("")
                .build();

        return userRep.save(user);
    }

    /**
     * Finds a user by their unique identifier.
     *
     * @return the User entity
     * @throws EntityNotFoundException if no user exists with the given ID
     */
    @Override
    public User findById(UUID userId) {
        return userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
                        " was not found"));
    }

    @Override
    public User findByUsername(String username) {
        return userRep.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("The user with the username: " + username +
                        " was not found"));
    }
}
