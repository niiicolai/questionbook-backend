import User from '../models/user.js';

export default async function userPasswordProtection(req, res, next) {
    const { sub: userId } = req.user;
    const { currentPassword } = req.body;

    const user = await new User().find(userId);
    if (!user) {
        res.status(500).json('Internal Server Error');
        return;
    }

    if (currentPassword) {
        const isPasswordCorrect = await user.comparePassword(user.password, currentPassword);
        if (!isPasswordCorrect) {
            res.status(403).json('Forbidden');
            return;
        }
    }

    next();
}
