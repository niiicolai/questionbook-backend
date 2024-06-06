import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import Answer from '../models/answer.js';
import AnswerDTO from '../dtos/answer.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';

const router = express.Router()
const service = new EntityService(new Answer(), AnswerDTO);
const stateChangeMiddleware = [jwtProtection, csrfProtection]

router.route('/api/v1/answer/:id')
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
router.route('/api/v1/answers')
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
    .post(stateChangeMiddleware, async (req, res) => {
        try {
            const record = await service.create(req.body);
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
