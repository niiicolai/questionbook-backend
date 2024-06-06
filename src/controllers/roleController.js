import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import Role from '../models/role.js';
import RoleDTO from '../dtos/role.js';

const router = express.Router()
const service = new EntityService(new Role(), RoleDTO);

router.route('/api/v1/role/:name')
    .get(async (req, res) => {
        try {
            const { name } = req.params;
            const record = await service.find(name);
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
router.route('/api/v1/roles')
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

export default router;