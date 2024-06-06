import GroupUser from '../models/groupUser.js';

export default async function groupUserProtection(req, res, next) {
    const { sub: userId } = req.user;
    const { id: groupUserId } = req.params;

    const model = new GroupUser();
    const ownEntity = await model.findByIdAndUserId(groupUserId, userId);
    if (!ownEntity) {
        res.status(403).json('Forbidden');
        return;
    }

    next();
}
