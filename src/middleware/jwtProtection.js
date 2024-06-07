import jwt from 'jsonwebtoken';

const debugMode = process.env.DEBUG;

export default function jwtProtection(req, res, next) {
    const header = req.header('Authorization');
    if (!header) {
        return res.status(401).send('Access denied');
    }

    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (debugMode) console.error(error);
        res.status(400).send('Invalid token');
    }
}
