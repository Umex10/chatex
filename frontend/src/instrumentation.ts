/**
 * @file Next.js instrumentation hook for bootstrapping the MSW mock server in test mode.
 * Ensures that backend requests are intercepted during development when APP_ENV is set to 'test'.
 */

/**
 * Next.js instrumentation registration function.
 * When running in the Node.js runtime with APP_ENV set to 'test',
 * it starts the MSW server to intercept and mock backend requests.
 */
export async function register() {
 
  if (process.env.NEXT_RUNTIME === 'nodejs') {
   
    if (process.env.APP_ENV === 'test') {
     
      // Start the msw server now
      const { server } = await import('../__tests__/mocks/node');
      
      server.listen({
        onUnhandledRequest: 'bypass', // requests not listet in handlers.ts are allowed
      });
      
      console.log('MSW Server-Side is running!');
    }
  }
}