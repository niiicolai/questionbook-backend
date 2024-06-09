import jwt from 'jsonwebtoken';

const debugMode = process.env.DEBUG;
/**
 * The idea of this class is to be able to have an endpoint,
 * where both an unauthenticated user and an authenticated user
 * can access the same endpoint, but the authenticated user
 * will have more privileges.
 */
export default function jwtDiscovery(req, res, next) {
    const header = req.header('Authorization');
    if (!header) {
        next();
        return;
    }

    const token = header.split(' ')[1];
    if (!token) {
        next();
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (debugMode) console.error(error);
        next();
    }
}
