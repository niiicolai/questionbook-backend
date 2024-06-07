import GroupUser from '../models/groupUser.js';
import Role from '../models/role.js';
import RolePermission from '../models/rolePermission.js';

export default function groupProtection(requiredPermissionNames=[]) {
    return async (req, res, next) => {
        const { sub: userId } = req.user;
        const { id: groupId } = req.params;
        console.log('groupId', groupId);

        const groupUser = await new GroupUser().findByGroupIdAndUserId(groupId, userId);
        if (!groupUser) {
            res.status(403).json('Forbidden');
            return;
        }

        const role = await new Role().find(groupUser.roleName);
        if (!role) {
            res.status(500).json('Internal Server Error');
            return;
        }

        const rolePermissions = await new RolePermission().findAllByRoleName(role.name);
        if (!rolePermissions) {
            res.status(500).json('Internal Server Error');
            return;
        }

        const permissionNames = rolePermissions.map(rolePermission => rolePermission.permissionName);
        req.permissions = permissionNames;
        
        if (requiredPermissionNames.length > 0) {
            for (const requiredPermissionName of requiredPermissionNames) {
                if (!permissionNames.includes(requiredPermissionName)) {
                    res.status(403).json('Forbidden');
                    return;
                }
            }
        }

        next();
    }
}
