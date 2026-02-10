package org.devtiro.chatex.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.CreateAccountRequestDto;
import org.devtiro.chatex.domain.dtos.UserDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping(path = "/sign-up")
    public ResponseEntity<UserDto> createAccount(
            @Valid @RequestBody CreateAccountRequestDto createAccountRequestDto
    ) {

        User user = userService.createAccount(createAccountRequestDto);
        UserDto userDto = userMapper.toDto(user);

        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

}
