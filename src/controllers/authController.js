import express from 'express'
import APIError from '../errors/APIError.js';
import AuthService from '../services/authService.js';

const router = express.Router()
const service = new AuthService();

router.route('/api/v1/auth')
    .post(async (req, res) => {
        try {
            const { email, password } = req.body;
            const { accessToken, csrfToken } = await service.login(email, password);

            res.cookie('csrfToken', csrfToken, { httpOnly: true, secure: true });
            res.send({ accessToken });
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
