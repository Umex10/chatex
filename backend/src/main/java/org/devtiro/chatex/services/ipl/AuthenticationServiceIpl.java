package org.devtiro.chatex.services.ipl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.devtiro.chatex.domain.entities.User;
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

    private Long jwtExpiryMs = 2592000000L; // 30 days

    @Override
    public UserDetails authenticate(String username, String key) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, key));
        // Need to return it, since authentication manager does only the validation
        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    public String createTk(User user) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims) // Infos which the frontend can read from without any request to the server: f.e Role
                .setSubject(user.getUsername()) // The user's email
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiryMs)) // Date needed for the server
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Our checksum
                .compact(); // Creates the xxxxx.yyyyy.zzzzz String
    }

    @Override
    public UserDetails validateTk(String tk) {
        String username = extractUsername(tk);
        return userDetailsService.loadUserByUsername(username);
    }

    @Override
    public String extractTk(HttpServletRequest request) {
        String bearerTk = request.getHeader("Authorization");

        if (bearerTk != null && bearerTk.startsWith("Bearer ")) {
            return bearerTk.substring(7);
        }
        return null;
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
