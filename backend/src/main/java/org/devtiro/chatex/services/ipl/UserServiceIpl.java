package org.devtiro.chatex.services.ipl;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
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
                .createdAt(LocalDate.now())
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
     * Returns all users who follow the user with the given username.
     * Loads the followers via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that follow the target user
     * @throws EntityNotFoundException if no user exists with the given username
     */
    @Override
    public Set<User> getFollowers(String username) {
        User user = userRep.findByUsernameWithFollowers(username).orElseThrow(
                () -> new EntityNotFoundException("The user with the username: " + username + " was not found"));

        return user.getFollowers();
    }

    /**
     * Returns all users that the user with the given username is following.
     * Loads the following list via a JOIN FETCH query to avoid lazy-loading issues.
     *
     * @return a Set of User entities that the target user follows
     * @throws EntityNotFoundException if no user exists with the given username
     */
    @Override
    public Set<User> getFollowing(String username) {
        User user = userRep.findByUsernameWithFollowing(username).orElseThrow(
                () -> new EntityNotFoundException("The user with the username: " + username + " was not found"));

        return user.getFollowing();
    }

    /**
     * Creates a follow relationship from the user identified by {@code userId}
     * to the user identified by {@code usernameToFollow}.
     * Both sides of the bidirectional Set are updated in a single transaction.
     *
     * @throws EntityNotFoundException if either user cannot be found
     */
    @Override
    @Transactional
    public void follow(UUID userId, String usernameToFollow) {

        User user = userRep.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("The user with the userId: " + userId + " was not found"));

        User userToFollow = userRep.findByUsername(usernameToFollow).orElseThrow(
                () -> new EntityNotFoundException(
                        "The user with the username: " + usernameToFollow + " was not found"));

        user.getFollowing().add(userToFollow);
        userToFollow.getFollowers().add(user);
    }

    /**
     * Removes the follow relationship between the user identified by {@code userId}
     * and the user identified by {@code usernameToFollow}.
     * Both sides of the bidirectional Set are updated in a single transaction.
     *
     * @throws EntityNotFoundException if either user cannot be found
     */
    @Override
    @Transactional
    public void unfollow(UUID userId, String usernameToFollow) {
        User user = userRep.findById(userId).orElseThrow(
                () -> new EntityNotFoundException("The user with the userId: " + userId + " was not found"));

        User userToUnfollow = userRep.findByUsername(usernameToFollow).orElseThrow(
                () -> new EntityNotFoundException(
                        "The user with the username: " + usernameToFollow + " was not found"));

        user.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(user);
    }

    /**
     * Checks whether the requesting user is already following the target user.
     * Delegates directly to the repository's COUNT-based query.
     *
     * @return {@code true} if the requesting user follows the target, {@code false} otherwise
     */
    @Override
    public boolean isUserFollowingTarget(String targetUsername, UUID requestingUserId) {
        return userRep.isUserFollowingTarget(targetUsername, requestingUserId);
    }

    /**
     * Returns the subset of {@code idsInList} that the given user is following.
     * Used for mass status checks to avoid the n+1 problem when rendering follow badges.
     *
     * @return a Set of UUIDs from {@code idsInList} that the user follows
     */
    @Override
    public Set<UUID> findFollowingIdsIn(UUID userId, Set<UUID> idsInList) {
      return userRep.findFollowingIdsIn(userId, idsInList);
    }

    /**
     * Returns the subset of {@code idsInList} that are following the given user.
     * Used for mass status checks to avoid the n+1 problem when rendering follow badges.
     *
     * @return a Set of UUIDs from {@code idsInList} that follow the user
     */
    @Override
    public Set<UUID> findFollowersIdsIn(UUID userId, Set<UUID> idsInList) {
        return userRep.findFollowersIdsIn(userId, idsInList);
    }

}
