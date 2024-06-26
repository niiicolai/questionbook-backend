import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import AnswerController from './src/controllers/answerController.js';
import QuestionController from './src/controllers/questionController.js';
import CommentController from './src/controllers/commentController.js';
import GroupController from './src/controllers/groupController.js';
import AuthController from './src/controllers/authController.js';
import UserController from './src/controllers/userController.js';
import GroupUserController from './src/controllers/groupUserController.js';
import RoleController from './src/controllers/roleController.js';
import PermissionController from './src/controllers/permissionController.js';
import RolePermissionController from './src/controllers/rolePermissionController.js';
import UploadController from './src/controllers/uploadController.js';

const app = express();
const port = 3001;
const origin = process.env.ALLOWED_ORIGIN;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin, credentials: true }));
app.use(cookieParser());
app.use(AnswerController);
app.use(QuestionController);
app.use(CommentController);
app.use(GroupController);
app.use(AuthController);
app.use(UserController);
app.use(GroupUserController);
app.use(RoleController);
app.use(PermissionController);
app.use(RolePermissionController);
app.use(UploadController);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});
