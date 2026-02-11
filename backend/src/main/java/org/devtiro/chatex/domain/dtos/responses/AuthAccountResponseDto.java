package org.devtiro.chatex.domain.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthAccountResponseDto {

    private String username;
    private String accessJwt;
    private Long accessTokenExpiresIn;
}
