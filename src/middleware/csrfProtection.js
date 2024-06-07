import csrf from '../config/csrf.js';

const debugMode = process.env.DEBUG;

export default function csrfProtection(req, res, next) {
    const token = req.cookies.csrfToken;
    if (!token) {
        if (debugMode) console.error('CSRF token not found');
        return res.status(403).send('Access denied');
    }

    const secret = req.user.csrfSecret;
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
