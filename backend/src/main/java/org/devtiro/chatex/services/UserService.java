package org.devtiro.chatex.services;

import java.util.UUID;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;

public interface UserService {

    User createAccount(SignUpAccountRequestDto signUpAccountRequestDto);

    User findById(UUID userId);

}
