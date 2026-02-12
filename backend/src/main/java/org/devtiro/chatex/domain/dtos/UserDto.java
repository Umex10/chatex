package org.devtiro.chatex.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for user information.
 * Contains basic user details for client-server communication.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private String name;

}
