package org.devtiro.chatex.services;

import org.devtiro.chatex.domain.CreateAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;

public interface UserService {

    User createAccount(CreateAccountRequestDto createAccountRequestDto);

}
