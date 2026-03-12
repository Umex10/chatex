package org.devtiro.chatex.domain.enums;

/**
 * Enumeration representing JWT token expiry types.
 * Defines different expiration periods for access and refresh tokens.
 */
public enum TkName {
    /**
     * Access token type with shorter expiration time (15 minutes).
     */
    ACCESS,
    /**
     * Refresh token type with longer expiration time (30 days).
     */
    REFRESH
}
