import PermissionService from '../services/permissionService.js';
import Comment from '../models/comment.js';

const permissionService = new PermissionService();

function ownershipProtection(bypassPermissionNames=[]) {
    if (!Array.isArray(bypassPermissionNames)) {
        throw new Error('bypassPermissionNames must be an array');
    }
    return async (req, res, next) => {
        const { sub: userId } = req.user;
        const { id: commentId } = req.params;

        if (!commentId) {
            res.status(400).json('Bad Request');
            return;
        }

        const model = new Comment();
        const record = await model.find(commentId);
        if (!record) {
            res.status(404).json(`Comment not found`);
            return;
        }

        if (record.userId === userId) {
            next();
            return;
        }

        const havePermissions = await permissionService
            .haveGlobalPermissions(userId, bypassPermissionNames);
            if (havePermissions) {
                next();
                return;
            }

        res.status(403).json('Forbidden');
    }
}

export default  {
    ownershipProtection
}