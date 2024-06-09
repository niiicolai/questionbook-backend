import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import Question from '../models/question.js';
import QuestionDTO from '../dtos/question.js';

import Group from '../models/group.js';
import GroupDTO from '../dtos/group.js';
import GroupMemberService from '../services/groupMemberService.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtDiscovery from '../middleware/jwtDiscovery.js';
import jwtProtection from '../middleware/jwtProtection.js';
import questionProtection from '../middleware/questionProtection.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

const router = express.Router()
const service = new EntityService(new Question(), QuestionDTO);
const groupService = new EntityService(new Group(), GroupDTO);
const groupMemberService = new GroupMemberService();

const createMiddleware = [
    jwtProtection,
    csrfProtection.originProtection,
    csrfProtection.tokenProtection,
]

const modifyMiddleware = [
    jwtProtection,
    csrfProtection.originProtection,
    csrfProtection.tokenProtection,
    questionProtection.ownershipProtection(['question:bypass:ownership'])
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

const checkCreateAccess = async (groupId, user) => {
    if (!user) throw new UnauthorizedError('Unauthorized');

    const isMember = await groupMemberService
        .isPartOfGroupOrHasPermissions(
            user.sub,
            groupId,
            ['group:bypass:membership']
        );

    if (!isMember) throw new ForbiddenError('Forbidden');
}

router.route('/api/v1/question/:id')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const { id } = req.params;
            const record = await service.find(id, null, [{
                table: 'users',
                on: 'questions.userId = users.id',
                as: 'user',
                columns: ['id', 'username'],
            }]);
            await checkViewAccess(record.groupId, req.user);
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
    .patch(modifyMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
            if (req.body.userId) delete req.body.userId;
            const record = await service.update(id, { ...req.body });
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
    .delete(modifyMiddleware, async (req, res) => {
        try {
            const { id } = req.params;
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
router.route('/api/v1/questions')
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
                    on: 'questions.userId = users.id',
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
            await checkCreateAccess(req.body.groupId, req.user);
            const record = await service.create({ ...req.body, userId });
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

export default router;
