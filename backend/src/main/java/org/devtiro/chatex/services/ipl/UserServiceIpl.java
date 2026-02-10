package org.devtiro.chatex.services.ipl;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.dtos.requests.CreateAccountRequestDto;
import org.devtiro.chatex.domain.entities.User;
import org.devtiro.chatex.reps.UserRep;
import org.devtiro.chatex.services.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceIpl implements UserService {

    private final UserRep userRep;
    private final PasswordEncoder encoder;

    @Override
    public User createAccount(CreateAccountRequestDto createAccountRequestDto) {

        String username = createAccountRequestDto.getUsername();
        String email = createAccountRequestDto.getEmail();
        String phone = createAccountRequestDto.getPhone();

        // Needed Checks, since these field have to be unique
        if(userRep.existsUserByUsername(username)) {
            throw new EntityExistsException("An user already exists with the username: " + username);
        } else if (userRep.existsUserByEmail(email)) {
            throw new EntityExistsException("An user already exists with the email: " + email);
        } else if (userRep.existsUserByPhone(phone)) {
            throw new EntityExistsException("An user already exists with the phone-number: " + phone);
        }

        // Using our bean from SecurityConfig
        String encodedKey = encoder.encode(createAccountRequestDto.getKey());

        User user = User.builder()
                .name(createAccountRequestDto.getName())
                .username(username)
                .email(email)
                .phone(phone)
                .key(encodedKey)
                .build();

        return userRep.save(user);
    }
}
