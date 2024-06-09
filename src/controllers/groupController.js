import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import GroupMemberService from '../services/groupMemberService.js';
import PermissionService from '../services/permissionService.js';

import Group from '../models/group.js';
import GroupDTO from '../dtos/group.js';
import GroupUser from '../models/groupUser.js';
import GroupUserDTO from '../dtos/groupUser.js';
import User from '../models/user.js';
import UserDTO from '../dtos/userPublic.js';

import jwtDiscovery from '../middleware/jwtDiscovery.js';
import jwtProtection from '../middleware/jwtProtection.js';
import groupProtection from '../middleware/groupProtection.js';
import csrfProtection from '../middleware/csrfProtection.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const router = express.Router()

const service = new EntityService(new Group(), GroupDTO);
const groupUserService = new EntityService(new GroupUser(), GroupUserDTO);
const userService = new EntityService(new User(), UserDTO);

const groupMemberService = new GroupMemberService();
const permissionService = new PermissionService();

const memberCheckMiddleware = [
    jwtProtection,
]
const createMiddleware = [
    jwtProtection,
    csrfProtection.originProtection,
    csrfProtection.tokenProtection
]
const patchMiddleware = [
    jwtProtection,
    csrfProtection.originProtection,
    csrfProtection.tokenProtection,
    groupProtection(['group:update'])
]
const deleteMiddleware = [
    jwtProtection,
    csrfProtection.originProtection,
    csrfProtection.tokenProtection,
    groupProtection(['group:delete'])
]

/**
 * If the group is private, the user must be a member of the group,
 * or have the permission to bypass group membership.
 */
const checkViewAccess = async (group, user) => {
    const { id: groupId } = group;
    if (group.isPrivate) {
        if (!user) throw new UnauthorizedError('Unauthorized');

        const isMember = await groupMemberService
            .isPartOfGroupOrHasPermissions(
                user.sub,
                groupId,
                ['group:bypass:membership']
            );

        if (!isMember) throw new ForbiddenError('Forbidden');
    }
}

router.route('/api/v1/is-member/group/:id')
    .get(memberCheckMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            const isMember = await groupMemberService.isPartOfGroup(req.user.sub, id);
            res.send({ isMember });
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })

router.route('/api/v1/group/:id')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const { id } = req.params;
            const group = await service.find(id);

            /**
             * If the group is private, you must be authenticated,
             * and you must be a member of the group to view it.
             * However, if you have the global permission to bypass
             * group membership, you can view the group.
             */
            await checkViewAccess(group, req.user);

            const ownerGroupUser = await new GroupUser().findByGroupIdAndRoleName(id, 'Group Owner');
            const owner = await userService.find(ownerGroupUser.userId);
            res.send({ group, owner });
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
    .patch(patchMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            const record = await service.update(id, req.body);
            res.send(record);
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
    .delete(deleteMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            // TODO: Cascade delete foreign key constraints
            await service.delete(id);
            res.sendStatus(204);
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
router.route('/api/v1/groups')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const where = { isPrivate: false };
            const { limit, page } = req.query;
            const params = { limit, page, where };
            /**
             * If there is a user, check if they got the global permission
             * to bypass group membership. and if that is the case, return
             * all groups, otherwise return only public groups.
             */
            const user = req.user;
            if (user) {
                const hasGlobalPermission = await permissionService
                    .haveGlobalPermissions(user.sub, ['group:bypass:membership']);
                if (hasGlobalPermission) {
                    delete params.where;
                }
            }
            const records = await service.paginate(params);
            res.send(records);
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
    .post(createMiddleware, async (req, res) => {
        try {
            const { sub: userId } = req.user;
            const group = await service.create(req.body);
            const groupUser = await groupUserService.create({
                groupId: group.id, userId, roleName: 'Group Owner'
            });
            res.send({ group, groupUser });
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
router.route('/api/v1/groups/user')
    .get(jwtProtection, async (req, res) => {
        try {
            const { sub: userId } = req.user;
            const { limit, page } = req.query;
            const groupUsers = await groupUserService.paginate({ limit, page, where: { userId } });
            const ids = groupUsers.rows.map(groupUser => groupUser.groupId);
            if (ids.length === 0) return res.send({ rows: [], pages: 0, count: 0 });
            const records = await service.paginate({ limit, page, where: { id: ids } });
            res.send(records);
        } catch (error) {
            if (error instanceof APIError) {
                res.status(error.code).json(error.message);
                return;
            }

            console.log(error);
            res.status(500).json('Internal Server Error');
        }
    })
export default router;
