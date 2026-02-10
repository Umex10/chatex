package org.devtiro.chatex.services;

import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;

public interface UserService {

    User createAccount(SignUpAccountRequestDto signUpAccountRequestDto);

}
