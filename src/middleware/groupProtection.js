import PermissionService from '../services/permissionService.js';

const permissionService = new PermissionService();

export default function groupProtection(requiredPermissionNames=[]) {
    return async (req, res, next) => {
        const { sub: userId } = req.user;
        const { id: groupId } = req.params;

        if (!groupId) {
            res.status(400).json('Bad Request');
            return;
        }

        /**
         * Check if the user has the required permissions.
         * It is possible to have the permissions in the group or globally.
         */
        const havePermissions = await permissionService
            .haveGroupOrGlobalPermissions(userId, groupId, requiredPermissionNames);

        if (!havePermissions) {
            res.status(403).json('Forbidden');
            return;
        }

        next();
    }
}
