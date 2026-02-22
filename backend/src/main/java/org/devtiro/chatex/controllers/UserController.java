package org.devtiro.chatex.controllers;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.UpdateUserDto;
import org.devtiro.chatex.domain.dtos.responses.UserDto;
import org.devtiro.chatex.domain.entities.User;
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

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final UserMapper userMapper;

  @GetMapping
  public ResponseEntity<UserDto> getUser(@RequestAttribute("userId") UUID userId) {

    User user = userService.findById(userId);

    UserDto userDto = userMapper.toDto(user);

    return new ResponseEntity<>(userDto, HttpStatus.OK);

  }

  @GetMapping(path = "/{username}")
  public ResponseEntity<UserDto> getUser(@PathVariable String username) {

    User user = userService.findByUsername(username);

    UserDto userDto = userMapper.toDto(user);

    return new ResponseEntity<>(userDto, HttpStatus.OK);
  }

  @PatchMapping
  public ResponseEntity<UserDto> updateUser(@RequestAttribute("userId") UUID userId,
@RequestBody UpdateUserDto updateUserDto) {

    User userToUpdate = userService.findById(userId);

    User updatedUser = userService.updateUser(userToUpdate, updateUserDto);

    UserDto userDto = userMapper.toDto(updatedUser);

    return new ResponseEntity<>(userDto, HttpStatus.OK);

  }

}
