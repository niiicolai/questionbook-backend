import PermissionService from '../services/permissionService.js';
import Answer from '../models/answer.js';

const permissionService = new PermissionService();

function ownershipProtection(bypassPermissionNames=[]) {
    if (!Array.isArray(bypassPermissionNames)) {
        throw new Error('bypassPermissionNames must be an array');
    }
    return async (req, res, next) => {
        const { sub: userId } = req.user;
        const { id: answerId } = req.params;

        if (!answerId) {
            res.status(400).json('Bad Request');
            return;
        }

        const model = new Answer();
        const record = await model.find(answerId);
        if (!record) {
            res.status(404).json(`Answer not found`);
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