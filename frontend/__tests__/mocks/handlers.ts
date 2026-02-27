/**
 * @file MSW request handler definitions for mocking backend API responses.
 * Handlers listed here intercept matching requests; unlisted routes pass through.
 */

import { http, HttpResponse } from 'msw';

/** Base URL of the backend API, sourced from environment or defaulting to localhost. */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Array of MSW request handlers used by the mock server.
 * Currently mocks all authentication endpoints, returning a mock access token
 * and setting a refresh token cookie.
 */
export const handlers = [
  http.post(`${BACKEND_URL}/api/v1/auth/**`, async ({ request }) => {

    const body = await request.clone().json() as Record<string, any>;

    if (body.username === "error-user") {
      return HttpResponse.json(
        {
          message: "Validation Error",
          errors: [
            { field: "username", message: "Username already taken" },
            { field: "email", message: "Email already taken" },
            { field: "phone", message: "Phone already taken" },
          ],
        },
        // Error
        { status: 400 } 
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        accessJwt: 'mock-access-token',
        expiresIn: 900
      }
    }, {
      status: 200,
      headers: {
        'Set-Cookie': 'refresh_jwt=mock-refresh-token; Path=/; HttpOnly; Max-Age=2592000'
      }
    });
  }),
];