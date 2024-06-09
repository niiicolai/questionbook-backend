import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import GroupMemberService from '../services/groupMemberService.js';
import Comment from '../models/comment.js';
import CommentDTO from '../dtos/comment.js';

import Answer from '../models/answer.js';
import AnswerDTO from '../dtos/answer.js';

import Question from '../models/question.js';
import QuestionDTO from '../dtos/question.js';

import Group from '../models/group.js';
import GroupDTO from '../dtos/group.js';

import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

import commentProtection from '../middleware/commentProtection.js';
import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';
import jwtDiscovery from '../middleware/jwtDiscovery.js';

const router = express.Router()
const service = new EntityService(new Comment(), CommentDTO);
const answerService = new EntityService(new Answer(), AnswerDTO);
const groupService = new EntityService(new Group(), GroupDTO);
const questionService = new EntityService(new Question(), QuestionDTO);
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
    commentProtection.ownershipProtection(['comment:bypass:ownership'])
]

/**
 * If the group is private, the user must be a member of the group,
 * or have the permission to bypass group membership.
 */
const checkViewAccess = async (answerId, user) => {
    const answer = await answerService.find(answerId);
    const questionId = answer.questionId;
    const question = await questionService.find(questionId);
    const groupId = question.groupId;
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

const checkCreateAccess = async (answerId, user) => {
    const answer = await answerService.find(answerId);
    const questionId = answer.questionId;
    const question = await questionService.find(questionId);
    const groupId = question.groupId;
    if (!user) throw new UnauthorizedError('Unauthorized');

    const isMember = await groupMemberService
        .isPartOfGroupOrHasPermissions(
            user.sub,
            groupId,
            ['group:bypass:membership']
        );

    if (!isMember) throw new ForbiddenError('Forbidden');
}

router.route('/api/v1/comment/:id')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const { id } = req.params;
            const record = await service.find(id, null, [{
                table: 'users',
                on: 'comments.userId = users.id',
                as: 'user',
                columns: ['id', 'username'],
            }]);
            await checkViewAccess(record.answerId, req.user);
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
router.route('/api/v1/comments')
    .get(jwtDiscovery, async (req, res) => {
        try {
            const { limit, page, answerId } = req.query;
            await checkViewAccess(answerId, req.user);
            let where = null;
            if (answerId) where = { answerId };
            const records = await service.paginate({limit, page, where, leftJoin: [{
                table: 'users',
                on: 'comments.userId = users.id',
                as: 'user',
                columns: ['id', 'username'],
            }]});
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
            await checkCreateAccess(req.body.answerId, req.user);
            const record = await service.create({...req.body, userId});
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
