package org.devtiro.chatex.services.ipl;

import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.devtiro.chatex.domain.TkExpiry;
import org.devtiro.chatex.services.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Implementation of the JwtService interface.
 * Handles JWT token creation, validation, and extraction using the JJWT library.
 */
@Service
@RequiredArgsConstructor
public class JwtServiceIpl implements JwtService {

  private final UserDetailsService userDetailsService;

  @Value("${jwt.secret}")
  private String secretKey;

  private final long REFRESH_TK = 1000L * 60 * 60 * 24 * 30;
  private final long ACCESS_TK = 1000L * 60 * 15;

  /**
   * Validates a JWT token and loads the associated user details.
   *
   * @return UserDetails for the user identified in the token
   */
  @Override
  public UserDetails validateTk(String tk) {
    String username = extractUsername(tk);
    return userDetailsService.loadUserByUsername(username);
  }

  /**
   * Creates an access JWT token with specified expiry.
   *
   * @return the generated JWT token string
   */
  @Override
  public String createAccessTk(String username, TkExpiry tkExpiry) {
    return createTk(username, tkExpiry);
  }

  /**
   * Creates a refresh JWT token and sets it as an HTTP-only cookie.
   *
   * @return void
   */
  @Override
  public void createRefreshTk(String username, TkExpiry tkExpiry,
      HttpServletResponse response) {

    String refreshToken = createTk(username, TkExpiry.REFRESH);

    // Send it as HTTP cookie
    Cookie refreshCookie = new Cookie("refresh_jwt", refreshToken);
    refreshCookie.setHttpOnly(true);
    refreshCookie.setSecure(false);
    refreshCookie.setPath("/");
    refreshCookie.setMaxAge(30 * 24 * 60 * 60);

    response.addCookie(refreshCookie);

  }

  /**
   * Extracts the access token from the Authorization header.
   *
   * @return the token string, or null if not present
   */
  @Override
  public String extractAccesTk(HttpServletRequest request) {

    String bearerTk = request.getHeader("Authorization");

    if (bearerTk != null && bearerTk.startsWith("Bearer ")) {
      return bearerTk.substring(7);
    }
    return null;
  }

  /**
   * Extracts the refresh token from HTTP cookies.
   *
   * @return the refresh token string, or null if not found
   */
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

  /**
   * Creates a JWT token with the specified username and expiry type.
   *
   * @return the generated JWT token string
   */
  private String createTk(String username, TkExpiry tkExpiry) {

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

  /**
   * Generates the signing key from the secret key.
   *
   * @return the cryptographic key for signing tokens
   */
  private Key getSigningKey() {
    byte[] keyBytes = secretKey.getBytes();
    return Keys.hmacShaKeyFor(keyBytes);
  }

  /**
   * Extracts the username from a JWT token.
   *
   * @return the username stored in the token
   */
  private String extractUsername(String tk) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(tk)
        .getBody();
    return claims.getSubject();
  }

}
