import jwt from 'jsonwebtoken';
import csrf from '../config/csrf.js';
import User from '../models/user.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import BadArgumentError from '../errors/BadArgumentError.js';

const model = new User();

export default class AuthService {
    async login(email, password) {
        if (!email) {
            throw new BadArgumentError('email is required');
        }
        if (!password) {
            throw new BadArgumentError('password is required');
        }
        
        const user = await model.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const validPassword = await model.comparePassword(user.password, password);
        if (!validPassword) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const iat = Math.floor(Date.now() / 1000);
        const expiresIn = process.env.JWT_EXPIRES_IN;
        const payload = { id: user.id, iat, expiresIn };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        const csrfToken = csrf.create();

        return { accessToken, csrfToken }
    }
}
