import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import RolePermission from '../models/rolePermission.js';
import RolePermissionDTO from '../dtos/rolePermission.js';

const router = express.Router()
const service = new EntityService(new RolePermission(), RolePermissionDTO);

router.route('/api/v1/role_permission/:id')
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
router.route('/api/v1/role_permissions')
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
