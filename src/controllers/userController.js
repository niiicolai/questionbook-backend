import express from 'express'
import APIError from '../errors/APIError.js';
import EntityService from '../services/entityService.js';
import AuthService from '../services/authService.js';
import User from '../models/user.js';
import UserDTO from '../dtos/user.js';

import csrfProtection from '../middleware/csrfProtection.js';
import jwtProtection from '../middleware/jwtProtection.js';
import userPasswordProtection from '../middleware/userPasswordProtection.js';

const router = express.Router()
const userService = new EntityService(new User(), UserDTO);
const authService = new AuthService();
const viewMiddleware = [jwtProtection, csrfProtection.originProtection]
const stateChangeMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection, userPasswordProtection]

router.route('/api/v1/user')
    .get(viewMiddleware, async (req, res) => {
        try {
            const { sub: id } = req.user;
            const record = await userService.find(id);
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
            const { sub: id } = req.user;
            const record = await userService.update(id, req.body);
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
            const { sub: id } = req.user;
            await userService.delete(id);
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
router.route('/api/v1/users')
    .get(async (req, res) => {
        try {
            const { limit, page } = req.query;
            const records = await userService.paginate({limit, page});
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
    .post(async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const roleName = 'User'
            const user = await new User().findByEmail(email);
            if (user) {
                res.status(400).json('Email already in use');
                return;
            }
            await userService.create({ username, email, password, roleName });
            const { accessToken, csrfToken } = await authService.login(email, password);
            res.cookie('csrfToken', csrfToken, { httpOnly: true });
            res.send({ accessToken })
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
