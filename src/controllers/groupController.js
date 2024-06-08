import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';

import Group from '../models/group.js';
import GroupDTO from '../dtos/group.js';
import GroupUser from '../models/groupUser.js';
import GroupUserDTO from '../dtos/groupUser.js';
import User from '../models/user.js';
import UserDTO from '../dtos/userPublic.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';
import groupProtection from '../middleware/groupProtection.js';

const router = express.Router()

const service = new EntityService(new Group(), GroupDTO);
const groupUserService = new EntityService(new GroupUser(), GroupUserDTO);
const userService = new EntityService(new User(), UserDTO);

const createMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection]
const patchMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection, groupProtection(['group:update'])]
const deleteMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection, groupProtection(['group:delete'])]

router.route('/api/v1/group/:id')
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const group = await service.find(id);
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
    .get(async (req, res) => {
        try {
            const { limit, page } = req.query;
            const records = await service.paginate({ limit, page });
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

export default router;
