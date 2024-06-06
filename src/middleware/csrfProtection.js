import csrf from '../config/csrf.js';

export default function csrfProtection(req, res, next) {
    const token = req.header('csrf-token');
    if (!token) {
        return res.status(403).send('Access denied');
    }

    if (!csrf.verify(token)) {
        return res.status(403).send('Access denied');
    }
}
