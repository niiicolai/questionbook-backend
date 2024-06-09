import express from 'express'
import APIError from '../errors/APIError.js';
import multer from 'multer'
import UploadService from '../services/uploadService.js';
import jwtProtection from '../middleware/jwtProtection.js';
import csrfProtection from '../middleware/csrfProtection.js';
import imageProtection from '../middleware/imageProtection.js';


const storage = multer.memoryStorage()
const upload = multer({ dest: 'uploads/', storage })
const service = new UploadService({ path: 'uploads/' });
const router = express.Router()
const putMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection, imageProtection.putProtection]
const modifyMiddleware = [jwtProtection, csrfProtection.originProtection, csrfProtection.tokenProtection, imageProtection.deleteProtection]

router.route('/api/v1/image/:filename')
    .get(async (req, res) => {
        try {
            const { filename } = req.params;
            const { file } = await service.find(filename);
            const base64 = Buffer.from(file).toString('base64');
            res.send(base64);
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
            const { filename } = req.params;
            await service.delete(filename);
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
router.route('/api/v1/images')
    .put(upload.single('file'), putMiddleware, async (req, res) => {
        try {
            const { sub: ownerId } = req.user;
            const { file } = req;
            const { type, uuid } = req.body;
            const record = await service.put(file, uuid, ownerId, type);
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
