/**
 * @file MSW (Mock Service Worker) server setup for the Node.js environment.
 * Used during testing to intercept outgoing HTTP requests made by server actions.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server instance configured with the defined request handlers.
 * Intercepts network requests in the Node.js environment during tests.
 */
export const server = setupServer(...handlers);