package org.devtiro.chatex;

import java.time.LocalDate;

import org.devtiro.chatex.domain.dtos.requests.SignInAccountRequestDto;
import org.devtiro.chatex.domain.dtos.requests.SignUpAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;

/**
 * Utility class providing reusable test data for unit and integration tests.
 * Contains factory methods for creating consistent test entities and DTOs.
 */
public class TestData {

    static String name = "max";
    static String username = "max123";
    static String email = "max@mail.com";
    static String phone = "+43 333 22222";
    static String key = "max+1234";
    static LocalDate createdAt = LocalDate.now();
    static String avatar = "avatar";
    static String banner = "banner";
    static String bio = "bio";
    static String location = "location";
    static String website = "website";

    /**
     * Creates a test {@link User} entity with predefined values.
     *
     * @return a new User instance populated with test data
     */
    public static User createTestUser() {
        return User.builder()
                .name(name)
                .username(username)
                .email(email)
                .phone(phone)
                .key(key)
                .createdAt(LocalDate.now())
                .avatar(avatar)
                .banner(banner)
                .bio(bio)
                .location(location)
                .website(website)
                .build();
    }

    /**
     * Creates a test {@link User} entity with predefined values plus a unique suffix.
     * Useful for creating multiple distinct users in a single test.
     *
     * @return a new User instance populated with test data plus the unique suffix
     */
    public static User createTestUser(String unique) {

        return User.builder()
                .name(name + unique)
                .username(username + unique)
                .email(email + unique)
                .phone(phone + unique)
                .key(key + unique)
                .createdAt(LocalDate.now())
                .avatar(avatar + unique)
                .banner(banner + unique)
                .bio(bio + unique)
                .location(location + unique)
                .website(website + unique)
                .build();
    }

    /**
     * Creates a test {@link SignUpAccountRequestDto} with predefined values.
     *
     * @return a new SignUpAccountRequestDto instance populated with test data
     */
    public static SignUpAccountRequestDto createSignUpAccountRequestDto() {
        return SignUpAccountRequestDto.builder()
                .name(name)
                .username(username)
                .email(email)
                .phone(phone)
                .key(key)
                .build();
    }

    /**
     * Creates a test {@link SignInAccountRequestDto} with predefined values.
     *
     * @return a new SignInAccountRequestDto instance populated with test data
     */
    public static SignInAccountRequestDto createSignInAccountRequestDto() {
        return SignInAccountRequestDto.builder()
                .username(username)
                .key(key)
                .build();
    }
}
