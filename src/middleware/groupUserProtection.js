import PermissionService from '../services/permissionService.js';
import GroupUser from "../models/groupUser.js";

const permissionService = new PermissionService();

function ownershipProtection(bypassPermissionNames=[]) {
    if (!Array.isArray(bypassPermissionNames)) {
        throw new Error('bypassPermissionNames must be an array');
    }
    return async (req, res, next) => {
        const { sub: userId } = req.user;
        const { groupId } = req.params;

        if (!groupId) {
            res.status(400).json('Bad Request');
            return;
        }

        const model = new GroupUser();
        const record = await model.findByGroupIdAndUserId(groupId, userId);
        if (record) {
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
