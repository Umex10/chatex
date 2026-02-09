package org.devtiro.chatex.controllers;

import jakarta.validation.Valid;
import org.devtiro.chatex.domain.CreateAccountRequestDto;
import org.devtiro.chatex.domain.dtos.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping(path = "/api/v1/auth")
public class AuthController {

    @PostMapping(path = "/sign-up")
    public ResponseEntity<UserDto> createAccount(
            @Valid @RequestBody CreateAccountRequestDto createAccountRequestDto
    ) {
        System.out.println(createAccountRequestDto);
        UserDto userDto = UserDto.builder()
                .name(createAccountRequestDto.getName())
                .build();

        return  new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

}
