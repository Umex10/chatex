package org.devtiro.chatex.controllers;

import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.dtos.requests.CreateAccountRequestDto;
import org.devtiro.chatex.domain.dtos.UserDto;
import org.devtiro.chatex.domain.dtos.responses.CreateAccountResponseDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.domain.mappers.UserMapper;
import org.devtiro.chatex.services.AuthenticationService;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationService authenticationService;


    @PostMapping(path = "/sign-up")
    public ResponseEntity<CreateAccountResponseDto> createAccount(
            @Valid @RequestBody CreateAccountRequestDto createAccountRequestDto
    ) {
        User user = userService.createAccount(createAccountRequestDto);

        CreateAccountResponseDto createAccountResponseDto = CreateAccountResponseDto.builder()
                .username(user.getUsername())
                .refreshJwt(authenticationService.createTk(user))
                .expiresIn(8555L)
                .build();

        return new ResponseEntity<>(createAccountResponseDto, HttpStatus.CREATED);
    }

}
