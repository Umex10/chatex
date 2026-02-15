package org.devtiro.chatex;

import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;

public class TestData {

    static String name = "max";
    static String username = "max123";
    static String email = "max@mail.com";
    static String phone = "+43 333 22222";
    static String key = "max+1234";

    public static User createTestUser() {
        return User.builder()
                .name(name)
                .username(username)
                .email(email)
                .phone(phone)
                .key(key)
                .build();
    }

    public static SignUpAccountRequestDto createSignUpAccountRequestDto() {
        return SignUpAccountRequestDto.builder()
                .name(name)
                .username(username)
                .email(email)
                .phone(phone)
                .key(key)
                .build();
    }

    public static SignInAccountRequestDto createSignInAccountRequestDto() {
        return SignInAccountRequestDto.builder()
                .username(username)
                .key(key)
                .build();
    }
}
