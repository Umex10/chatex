package org.devtiro.chatex.services.ipl;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.ApiError;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.exceptions.OwnException;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.FollowService;
import org.devtiro.chatex.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the UserService interface.
 * Handles user account creation and retrieval operations with validation.
 */
@Service
@RequiredArgsConstructor
public class UserServiceIpl implements UserService {

    private final UserRep userRep;
    private final PasswordEncoder encoder;
    private final FollowService followService;

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

        List<ApiError.FieldError> errors = new ArrayList<>();

        // Needed Checks, since these field have to be unique
        if (userRep.existsUserByUsername(username)) {
            errors.add(ApiError.FieldError.builder().field("username")
                    .message("Username already taken").build());
        }
        if (userRep.existsUserByEmail(email)) {
            errors.add(ApiError.FieldError.builder().field("email")
                    .message("Email already taken").build());
        }
        if (userRep.existsUserByPhone(phone)) {
            errors.add(ApiError.FieldError.builder().field("phone")
                    .message("Phone-number already taken").build());
        }

        if (!errors.isEmpty()) {
            throw new OwnException(errors);
        }

        // Using our bean from SecurityConfig
        String encodedKey = encoder.encode(signUpAccountRequestDto.getKey());

        User user = User.builder()
                .name(signUpAccountRequestDto.getName())
                .username(username)
                .email(email)
                .phone(phone)
                .key(encodedKey)
                .createdAt(ZonedDateTime.now())
                .avatar("")
                .banner("")
                .bio("")
                .location("")
                .website("")
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

    /**
     * Finds a user by their username.
     *
     * @return the User entity
     * @throws EntityNotFoundException if no user exists with the given username
     */
    @Override
    public User findByUsername(String username) {
        return userRep.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("The user with the username: " + username +
                        " was not found"));
    }

    /**
     * Updates a user's profile fields (name, bio, location, website) and persists
     * the changes.
     *
     * @return the updated and persisted User entity
     */
    @Override
    public User updateUser(User userToUpdate, UpdateUserDto updateUserDto) {

        userToUpdate.setName(updateUserDto.getName());
        userToUpdate.setAvatar(updateUserDto.getAvatar());
        userToUpdate.setBanner(updateUserDto.getBanner());
        userToUpdate.setBio(updateUserDto.getBio());
        userToUpdate.setLocation(updateUserDto.getLocation());
        userToUpdate.setWebsite(updateUserDto.getWebsite());

        return userRep.save(userToUpdate);
    }

    /**
     * {@inheritDoc}
     *
     * Looks up the user and returns their recently viewed users.
     */
    @Override
    public Set<User> getRecentlyViewedUsers(UUID userId) {
        User me = userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
                        " was not found"));

        return me.getRecentlyViewed();
    }

    /**
     * {@inheritDoc}
     *
     * Adds the target user to the recently viewed list of the given user.
     */
    @Override
    public void addUserToRecentlyViewedUsersList(User targetUser, UUID userId) {
        User me = userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
                        " was not found"));
        me.getRecentlyViewed().add(targetUser);

        userRep.save(me);
    }

    /**
     * {@inheritDoc}
     *
     * Silences the target user for the given user, and updates follow relationships if necessary.
     */
    @Override
    @Transactional
    public void silenceUser(String username, UUID userId) {
        User me = userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
                        " was not found"));

        User userToSilence = userRep.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("The user with the username: " + username +
                        " was not found"));

        me.getSilencedUsers().add(userToSilence);
        userToSilence.getSilencedBy().add(me);

        boolean isUserFollowingTarget = followService.isUserFollowingTarget(username, userId);
        boolean isTargetFollowingUser = followService.isTargetFollowingUser(username, userId);

        if (isUserFollowingTarget) {
            me.getFollowing().remove(userToSilence);
            userToSilence.getFollowers().remove(me);
        }

        if (isTargetFollowingUser) {
            userToSilence.getFollowing().remove(me);
            me.getFollowers().remove(userToSilence);
        }

        userRep.save(me);
        userRep.save(userToSilence);
    }

    /**
     * {@inheritDoc}
     *
     * Removes the silence status for the target user.
     */
    @Override
    @Transactional
    public void unSilenceUser(String username, UUID userId) {
        User me = userRep.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("The user with the userid: " + userId +
                        " was not found"));

        User userToSilence = userRep.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("The user with the username: " + username +
                        " was not found"));

        me.getSilencedUsers().remove(userToSilence);
        userToSilence.getSilencedBy().remove(me);

        userRep.save(me);
        userRep.save(userToSilence);
    }

    /**
     * {@inheritDoc}
     *
     * Checks if the user is silencing the target user.
     */
    @Override
    public boolean isUserSilencingTarget(String username, UUID userId) {
        return userRep.isUserSilencingTarget(username, userId);
    }

    /**
     * {@inheritDoc}
     *
     * Checks if the target user is silencing the user.
     */
    @Override
    public boolean isTargetSilencingUser(String username, UUID userId) {
        return userRep.isTargetSilencingUser(username, userId);
    }
}
