package org.devtiro.chatex.controllers;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.FollowDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.FollowMapper;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * REST controller handling user profile operations.
 * Provides endpoints for retrieving and updating user account data.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final UserMapper userMapper;
  private final FollowMapper followMapper;

  /**
   * Retrieves the currently authenticated user's profile.
   * The user ID is resolved from the JWT token via the request attribute set by
   * the filter.
   *
   * @return ResponseEntity containing the user's profile data
   */
  @GetMapping
  public ResponseEntity<UserDto> getUser(@RequestAttribute("userId") UUID userId) {

    User user = userService.findById(userId);

    UserDto userDto = userMapper.toDto(user);

    return new ResponseEntity<>(userDto, HttpStatus.OK);

  }

  /**
   * Retrieves a user's public profile by their username.
   *
   * @return ResponseEntity containing the user's profile data
   */
  @GetMapping(path = "/{username}")
  public ResponseEntity<UserDto> getUser(@PathVariable String username) {

    User user = userService.findByUsername(username);

    UserDto userDto = userMapper.toDto(user);

    return new ResponseEntity<>(userDto, HttpStatus.OK);
  }

  /**
   * Updates the currently authenticated user's profile with the provided data.
   * Only the fields name, bio, location, and website can be updated.
   *
   * @return ResponseEntity containing the updated user profile data
   */
  @PatchMapping
  public ResponseEntity<UserDto> updateUser(@RequestAttribute("userId") UUID userId,
      @RequestBody UpdateUserDto updateUserDto) {

    User userToUpdate = userService.findById(userId);

    User updatedUser = userService.updateUser(userToUpdate, updateUserDto);

    UserDto userDto = userMapper.toDto(updatedUser);

    return new ResponseEntity<>(userDto, HttpStatus.OK);

  }

  @GetMapping(path = "/followers/{username}")
  public ResponseEntity<List<FollowDto>> getFollowers(@PathVariable String username) {
    Set<User> followers = userService.getFollowers(username);

    List<FollowDto> followersDto = followMapper.toDtoList(followers);

    return ResponseEntity.ok(followersDto);
  }

  @GetMapping(path = "/following/{username}")
  public ResponseEntity<List<FollowDto>> getFollowing(@PathVariable String username) {
    Set<User> following = userService.getFollowing(username);

    List<FollowDto> followingDto = followMapper.toDtoList(following);

    return ResponseEntity.ok(followingDto);
  }

  @PostMapping(path = "/follow")
  public ResponseEntity<Void> follow(@RequestAttribute UUID userId, @RequestBody String usernameToFollow) {

    String cleanUsername = usernameToFollow.replace("\"", "").trim();
    userService.follow(userId, cleanUsername);

    return new ResponseEntity<Void>(HttpStatus.OK);
  }

}
