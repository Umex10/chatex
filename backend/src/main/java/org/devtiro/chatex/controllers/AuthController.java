package org.devtiro.chatex.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.devtiro.chatex.domain.TkName;
import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.AuthResponseDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.services.AuthenticationService;
import org.devtiro.chatex.services.JwtService;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling authentication operations.
 * Provides endpoints for user sign-up, sign-in, and access token generation.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

        private final UserService userService;
        private final AuthenticationService authenticationService;
        private final JwtService jwtService;

        /**
         * Handles user sign-up requests.
         * Creates a new user account and returns authentication tokens.
         *
         * @return ResponseEntity containing the authentication response with access token
         */
        @PostMapping(path = "/sign-up")
        public ResponseEntity<AuthResponseDto> signUpAccount(
                        @Valid @RequestBody SignUpAccountRequestDto signUpAccountRequestDto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                User user = userService.createAccount(signUpAccountRequestDto);

                AuthResponseDto authResponseDto = createAuthResponseDto(user.getUsername(),
                                response);

                return new ResponseEntity<>(authResponseDto, HttpStatus.CREATED);
        }

        /**
         * Handles user sign-in requests.
         * Authenticates user credentials and returns authentication tokens.
         *
         * @return ResponseEntity containing the authentication response with access token
         */
        @PostMapping(path = "/sign-in")
        public ResponseEntity<AuthResponseDto> signInAccount(
                        @Valid @RequestBody SignInAccountRequestDto signUpAccountRequestDto,
                        HttpServletRequest request,
                        HttpServletResponse response) {

                UserDetails userDetails = authenticationService.authenticate(
                                signUpAccountRequestDto.getUsername(),
                                signUpAccountRequestDto.getKey());

                AuthResponseDto authResponseDto = createAuthResponseDto(userDetails.getUsername(),
                                response);

                return ResponseEntity.ok(authResponseDto);
        }

        /**
         * Creates a new access token using a valid refresh token.
         * Validates the refresh token from cookies and generates a new access token.
         *
         * @return ResponseEntity containing the authentication response or error status
         */
        @GetMapping(path = "/access-jwt")
        public ResponseEntity<?> createAccessJwt(HttpServletRequest request,
                        HttpServletResponse response) {

                String refreshTk = jwtService.extractRefreshTk(request);

                if (refreshTk == null || refreshTk.isEmpty()) {
                        System.out.println("Refresh token exisitiert net!");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                        .body("The refresh token is missing");
                }

                UserDetails userDetails = jwtService.validateTk(refreshTk);

                AuthResponseDto authResponseDto = createAuthResponseDto(userDetails.getUsername(),
                                null);

                return ResponseEntity.ok(authResponseDto);

        }

        /**
         * Creates an authentication response DTO with access and refresh tokens.
         * Generates access token and optionally creates refresh token cookie.
         *
         * @return AuthResponseDto containing the access token and expiration time
         */
        private AuthResponseDto createAuthResponseDto(
                        String username,
                        HttpServletResponse response) {

                String accessTk = jwtService.createAccessTk(username,
                                TkName.ACCESS);

                if (response != null) {
                        jwtService.createRefreshTk(username,
                                        TkName.REFRESH, response);
                }

                return AuthResponseDto.builder()
                                .accessJwt(accessTk)
                                .expiresIn(15 * 60L)
                                .build();
        }
}
