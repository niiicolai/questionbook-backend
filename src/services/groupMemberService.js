import GroupUser from "../models/groupUser.js";
import PermissionService from "./permissionService.js";
import NotFoundError from "../errors/NotFoundError.js";

const groupUserModel = new GroupUser();

export default class GroupMemberService {
    constructor() {
    }

    async isPartOfGroup(userId, groupId) {
        const groupUser = await groupUserModel.findByGroupIdAndUserId(groupId, userId);
        return !!groupUser;
    }

    async isPartOfGroupOrHasPermissions(userId, groupId, permissions) {
        const groupUser = await groupUserModel.findByGroupIdAndUserId(groupId, userId);
        if (groupUser) return true;

        const permissionService = new PermissionService();
        return await permissionService.haveGlobalPermissions(userId, permissions);
    }

    async isOwner(userId, groupId) {
        const groupUser = await groupUserModel.findByGroupIdAndUserId(groupId, userId);
        return groupUser?.roleName === 'Group Owner';
    }

    async getGroupRole(userId, groupId) {
        const groupUser = await groupUserModel.findByGroupIdAndUserId(groupId, userId);
        if (!groupUser) throw new NotFoundError('User is not a member of this group');
        return groupUser.roleName;
    }
}
