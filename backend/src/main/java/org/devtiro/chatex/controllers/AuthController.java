package org.devtiro.chatex.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.dtos.responses.AuthResponseDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.services.AuthenticationService;
import org.devtiro.chatex.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

        private final UserService userService;
        private final AuthenticationService authenticationService;

        @PostMapping(path = "/sign-up")
        public ResponseEntity<AuthResponseDto> signUpAccount(
                        @Valid @RequestBody SignUpAccountRequestDto signUpAccountRequestDto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                User user = userService.createAccount(signUpAccountRequestDto);
                String username = user.getUsername();

                AuthResponseDto authResponseDto = authenticationService.createAuthResponseDto(username, request,
                                response);

                return new ResponseEntity<>(authResponseDto, HttpStatus.CREATED);
        }

        @PostMapping(path = "/sign-in")
        public ResponseEntity<AuthResponseDto> signInAccount(
                        @Valid @RequestBody SignInAccountRequestDto signUpAccountRequestDto,
                        HttpServletRequest request,
                        HttpServletResponse response) {
                UserDetails userDetails = authenticationService.authenticate(
                                signUpAccountRequestDto.getUsername(),
                                signUpAccountRequestDto.getKey());

                String username = userDetails.getUsername();

                AuthResponseDto authResponseDto = authenticationService.createAuthResponseDto(username, request,
                                response);

                return ResponseEntity.ok(authResponseDto);
        }

        @GetMapping(path = "/access-jwt")
        public ResponseEntity<?> createAccessJwt(HttpServletRequest request,
                        HttpServletResponse response) {

                System.out.println("Wurde erreicht!");

                String refreshTk = authenticationService.extractRefreshTk(request);

                if (refreshTk == null || refreshTk.isEmpty()) {
                        System.out.println("Refresh token exisitiert net!");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("The refresh token is missing");
                }

                 System.out.println("Refresh token exisitert!");

                UserDetails userDetails = authenticationService.validateTk(refreshTk);

                 System.out.println("Refresh token ist valid!");

                AuthResponseDto authResponseDto = authenticationService.createAuthResponseDto(userDetails.getUsername(),
                                request, response);

                return ResponseEntity.ok(authResponseDto);

        }

}
