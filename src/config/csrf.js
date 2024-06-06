import Tokens from 'csrf';

const token = Tokens();
const secret = token.secretSync();

export default {
    secret,
    create: ()=> token.create(secret),
    verify: ()=> token.verify(secret),
}
