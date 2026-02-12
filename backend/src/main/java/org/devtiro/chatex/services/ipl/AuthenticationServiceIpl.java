package org.devtiro.chatex.services.ipl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.TkExpiry;
import org.devtiro.chatex.domain.dtos.responses.AuthResponseDto;
import org.devtiro.chatex.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceIpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Value("${jwt.secret}")
    private String secretKey;

    private final long REFRESH_TK = 1000L * 60 * 60 * 24 * 30;
    private final long ACCESS_TK = 1000L * 60 * 15;

    // The authentication Manager will tell us if the user credentials
    // are valid
    @Override
    public UserDetails authenticate(String username, String key) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, key));
        // Need to return it, since authentication manager does only the validation
        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    public AuthResponseDto createAuthResponseDto(String username,
            HttpServletRequest request, HttpServletResponse response) {

        String accessTk = createTk(username, TkExpiry.ACCESS);

        String refreshTk = extractRefreshTk(request);

        if (refreshTk == null || refreshTk.isEmpty()) {

            System.out.println("Cookie was not found!");

            String refreshToken = createTk(username, TkExpiry.REFRESH);

            // Send it as HTTP cookie
            Cookie refreshCookie = new Cookie("refresh_jwt", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(30 * 24 * 60 * 60);

            response.addCookie(refreshCookie);
        }

        return AuthResponseDto.builder()
                .accessJwt(accessTk)
                .expiresIn(15 * 60L)
                .build();
    }

    @Override
    public String createTk(String username, TkExpiry tkExpiry) {

        long expiryMs;
        if (tkExpiry == TkExpiry.ACCESS) {
            expiryMs = ACCESS_TK;
        } else {
            expiryMs = REFRESH_TK;
        }

        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims) // Infos which the frontend can read from without any request to the server: f.e
                                   // Role
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .claim("type_jwt", tkExpiry)
                .setExpiration(new Date(System.currentTimeMillis() + expiryMs)) // Date needed for the server
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Our checksum
                .compact(); // Creates the xxxxx.yyyyy.zzzzz String
    }

    @Override
    public UserDetails validateTk(String tk) {
        String username = extractUsername(tk);
        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    public String extractAccesTk(HttpServletRequest request) {

        String bearerTk = request.getHeader("Authorization");

        if (bearerTk != null && bearerTk.startsWith("Bearer ")) {
            return bearerTk.substring(7);
        }
        return null;
    }

    @Override
    public String extractRefreshTk(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> "refresh_jwt".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private String extractUsername(String tk) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(tk)
                .getBody();
        return claims.getSubject();
    }

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
