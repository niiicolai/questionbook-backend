import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import Comment from '../models/comment.js';
import CommentDTO from '../dtos/comment.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';

const router = express.Router()
const service = new EntityService(new Comment(), CommentDTO);
const stateChangeMiddleware = [jwtProtection, csrfProtection]

router.route('/api/v1/comment/:id')
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
    .patch(stateChangeMiddleware, async (req, res) => {
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
    .delete(stateChangeMiddleware, async (req, res) => {
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
    .get(async (req, res) => {
        try {
            const { limit, page, answerId } = req.query;
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
    .post(stateChangeMiddleware, async (req, res) => {
        try {
            const { sub: userId } = req.user;
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
