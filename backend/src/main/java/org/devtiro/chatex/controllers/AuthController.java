package org.devtiro.chatex.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.TkExpiry;
import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.AuthAccountResponseDto;
import org.devtiro.chatex.domain.entities.User;
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
    public ResponseEntity<AuthAccountResponseDto> signUpAccount(
            @Valid @RequestBody SignUpAccountRequestDto signUpAccountRequestDto
    ) {
        User user = userService.createAccount(signUpAccountRequestDto);
        String username = user.getUsername();

        AuthAccountResponseDto authAccountResponseDto = authenticationService.createAuthAccountResponseDto(username);

        return new ResponseEntity<>(authAccountResponseDto, HttpStatus.CREATED);
    }

    @PostMapping(path = "/sign-in")
    public ResponseEntity<AuthAccountResponseDto> signInAccount(
            @Valid @RequestBody SignInAccountRequestDto signUpAccountRequestDto
    ) {
        UserDetails userDetails = authenticationService.authenticate(
                signUpAccountRequestDto.getUsername(),
                signUpAccountRequestDto.getKey()
        );

        String username = userDetails.getUsername();

        AuthAccountResponseDto authAccountResponseDto = authenticationService.createAuthAccountResponseDto(username);

        return new ResponseEntity<>(authAccountResponseDto, HttpStatus.CREATED);
    }

}
