package org.devtiro.chatex.controllers;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.services.FollowService;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * REST controller handling user profile operations.
 * Provides endpoints for retrieving and updating user account data.
 */
@RestController
@RequestMapping(path = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final FollowService followService;
  private final UserMapper userMapper;

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
  public ResponseEntity<UserDto> getUser(@RequestAttribute UUID userId,
      @PathVariable String username) {

    User user = userService.findByUsername(username);

    UserDto userDto = userMapper.toDto(user);

    boolean isUserFollowingTarget = followService.isUserFollowingTarget(username, userId);
    userDto.setUserFollowingTarget(isUserFollowingTarget);

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

}
