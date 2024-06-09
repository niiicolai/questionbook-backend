import User from "../models/user.js";
import Role from "../models/role.js";
import RolePermission from "../models/rolePermission.js";
import GroupUser from "../models/groupUser.js";

import NotFoundError from "../errors/NotFoundError.js";

const userModel = new User();
const roleModel = new Role();
const rolePermissionModel = new RolePermission();
const groupUserModel = new GroupUser();

export default class PermissionService {
    constructor() {
    }

    async haveGroupPermissions(userId, groupId, permissions) {
        const user = await userModel.find(userId);
        if (!user) throw new NotFoundError('User not found');

        try {
            const groupUser = await groupUserModel.findByGroupIdAndUserId(groupId, userId);
            if (!groupUser) return false;

            const role = await roleModel.find(groupUser.roleName);
            if (!role) return false;

            const rolePermissions = await rolePermissionModel.findAllByRoleName(role.name);
            if (!rolePermissions) return false;

            const permissionNames = rolePermissions.map(rolePermission => rolePermission.permissionName);
            return permissions.every(permission => permissionNames.includes(permission));
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async haveGlobalPermissions(userId, permissions) {
        const user = await userModel.find(userId);
        if (!user) throw new NotFoundError('User not found');

        try {
            const role = await roleModel.find(user.roleName);
            if (!role) return false;

            const rolePermissions = await rolePermissionModel.findAllByRoleName(role.name);
            if (!rolePermissions) return false;

            const permissionNames = rolePermissions.map(rolePermission => rolePermission.permissionName);
            return permissions.every(permission => permissionNames.includes(permission));
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async haveGroupOrGlobalPermissions(userId, groupId, permissions) {
        return (
            await this.haveGroupPermissions(userId, groupId, permissions) ||
            await this.haveGlobalPermissions(userId, permissions)
        );
    }
}
