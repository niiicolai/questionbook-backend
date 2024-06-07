import Tokens from 'csrf';

const token = Tokens();

export default {
    create: async () => {
        const csrfSecret = await token.secret();
        const csrfToken = token.create(csrfSecret);
        return { csrfToken, csrfSecret };
    },
    verify: async (inputToken, inputSecret) => {
        return await token.verify(inputToken, inputSecret)
    },
}
