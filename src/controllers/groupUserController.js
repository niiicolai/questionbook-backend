import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import GroupUser from '../models/groupUser.js';
import GroupUserDTO from '../dtos/groupUser.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';
import groupUserProtection from '../middleware/groupUserProtection.js';

const router = express.Router()
const model = new GroupUser();
const service = new EntityService(model, GroupUserDTO);
const createMiddleware = [jwtProtection, csrfProtection]
const modifyMiddleware = [jwtProtection, csrfProtection, groupUserProtection]

router.route('/api/v1/group_user/:id')
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const record = await service.find(id);
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
router.route('/api/v1/group_users')
    .get(async (req, res) => {
        try {
            const { limit, page } = req.query;
            const records = await service.paginate({limit, page});
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
