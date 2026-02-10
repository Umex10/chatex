package org.devtiro.chatex.domain.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpAccountRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, message = "Name must be at least {min} characters.")
    private String name;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between {min} and {max} characters.")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address.")
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(min = 10, message = "Phone must be at least {min} characters.")
    private String phone;

    @NotBlank(message = "key is required")
    @Size(min = 6, message = "Key must be at least {min} characters.")
    private String key;

}
