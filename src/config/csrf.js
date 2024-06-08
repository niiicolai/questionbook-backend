// npm: https://www.npmjs.com/package/csrf
import Tokens from 'csrf';

// An object that can be used to the following:
// - Generate a random secret
// - Create a CSRF token
// - Verify a CSRF token
const token = Tokens();

export default {
    /**
     * @function create
     * @description Generates a random secret and creates a CSRF token based on it
     * @returns {Promise<{csrfToken: string, csrfSecret: string}>} A promise that contains 
     * the CSRF token and secret
     * @async
     */
    create: async () => {
        // Generates an random secret
        const csrfSecret = await token.secret();
        // Creates a CSRF token based on the secret
        const csrfToken = token.create(csrfSecret);
        return { csrfToken, csrfSecret };
    },
    /**
     * @function verify
     * @description Verifies a CSRF token
     * @param {string} inputToken The CSRF token to verify
     * @param {string} inputSecret The secret used to create the CSRF token
     * @returns {boolean} True if the CSRF token is valid, false otherwise
     * @async
     */
    verify: async (inputToken, inputSecret) => {
        return await token.verify(inputToken, inputSecret)
    },
}





