import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import GroupMemberService from '../services/groupMemberService.js';
import GroupUser from '../models/groupUser.js';
import GroupUserDTO from '../dtos/groupUser.js';

import Group from '../models/group.js';
import GroupDTO from '../dtos/group.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';
import jwtDiscovery from '../middleware/jwtDiscovery.js';
import groupUserProtection from '../middleware/groupUserProtection.js';

const router = express.Router()
const model = new GroupUser();
const service = new EntityService(model, GroupUserDTO);
const groupService = new EntityService(new Group(), GroupDTO);
const groupMemberService = new GroupMemberService();

const createMiddleware = [
    jwtProtection, 
    csrfProtection.originProtection, 
    csrfProtection.tokenProtection
]

const modifyMiddleware = [
    jwtProtection, 
    csrfProtection.originProtection, 
    csrfProtection.tokenProtection, 
    groupUserProtection.ownershipProtection(['group_user:bypass:ownership'])
]

/**
 * If the group is private, the user must be a member of the group,
 * or have the permission to bypass group membership.
 */
const checkViewAccess = async (groupId, user) => {
    const group = await groupService.find(groupId);
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

router.route('/api/v1/group_user/:groupId')
    .delete(modifyMiddleware, async (req, res) => {
        try {
            const { sub: userId } = req.user;
            const { groupId } = req.params;
            const record = await model.findByGroupIdAndUserId(groupId, userId);
            if (!record) {
                res.status(404).json('User is not a member of this group');
                return;
            }
            
            if (record.roleName === 'Group Owner') {
                res.status(400).json('Cannot remove the owner of a group');
                return;
            }

            const { count } = await service.paginate({
                limit: 1, page: 1,
                where: { groupId: record.groupId }
            });

            if (count === 1) {
                res.status(400).json('Cannot remove the last member of a group');
                return;
            }

            await service.delete(record.id);
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
router.route('/api/v1/group_users')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const { limit, page, groupId } = req.query;
            if (!groupId) {
                res.status(400).json('groupId is required');
                return;
            }
            await checkViewAccess(groupId, req.user);
            const where = { groupId };
            const records = await service.paginate({
                limit, page, where, leftJoin: [{
                    table: 'users',
                    on: '_group_users.userId = users.id',
                    as: 'user',
                    columns: ['id', 'username'],
                }]
            });
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
            const { groupId } = req.body;
            const roleName = 'Group Member';

            const exists = await model.findByGroupIdAndUserId(groupId, userId);
            if (exists) {
                res.status(400).json('User is already a member of this group');
                return;
            }

            const record = await service.create({ userId, groupId, roleName });
            res.send(record)
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
