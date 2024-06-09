import csrf from '../config/csrf.js';
import CsrfAuthentication from '../models/csrfAuthentication.js';

const debugMode = process.env.DEBUG;
const csrfAuthenticationModel = new CsrfAuthentication();

function originProtection(req, res, next) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    if (!origin && !referer) {
        if (debugMode) console.error('Origin not found');
        return res.status(403).send('Access denied');
    }
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!allowedOrigins.includes(origin) && !allowedOrigins.includes(referer)) {
        if (debugMode) console.error('Invalid origin');
        return res.status(403).send('Access denied');
    }

    next();
}

async function tokenProtection(req, res, next) {
    const token = req.headers['x-csrf-token'];
    if (!token) {
        if (debugMode) console.error('CSRF token not found');
        return res.status(403).send('Access denied');
    }

    const userId = req.user.sub;
    const csrfAuthentication = await csrfAuthenticationModel.findByUserIdAndCsrfToken(userId, token);
    if (!csrfAuthentication) {
        if (debugMode) console.error('CSRF token not found');
        return res.status(403).send('Access denied');
    }

    const secret = csrfAuthentication.csrfSecret;
    if (!secret) {
        if (debugMode) console.error('CSRF secret not found');
        return res.status(403).send('Access denied');
    }

    if (!csrf.verify(token, secret)) {
        if (debugMode) console.error('Invalid CSRF token');
        return res.status(403).send('Access denied');
    }

    next();
}

export default {
    originProtection,
    tokenProtection
};
