import 'dotenv/config'

import Group from '../models/group.js';
import User from '../models/user.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';
import Comment from '../models/comment.js';
import Role from '../models/role.js';
import RolePermission from '../models/rolePermission.js';
import Permission from '../models/permission.js';
import GroupUser from '../models/groupUser.js';

const userModel = new User();
const groupModel = new Group();
const questionModel = new Question();
const answerModel = new Answer();
const commentModel = new Comment();
const roleModel = new Role();
const rolePermissionModel = new RolePermission();
const permissionModel = new Permission();
const groupUserModel = new GroupUser();

const up = async () => {
    await roleModel.createTable();
    await permissionModel.createTable();
    await rolePermissionModel.createTable();

    await userModel.createTable();
    await groupModel.createTable();
    await questionModel.createTable();
    await answerModel.createTable();
    await commentModel.createTable();
    await groupUserModel.createTable();
    
    console.log('Migration complete');
}

const down = async () => {
    await roleModel.dropTable();
    await permissionModel.dropTable();
    await rolePermissionModel.dropTable();

    await userModel.dropTable();
    await groupModel.dropTable();
    await questionModel.dropTable();
    await answerModel.dropTable();
    await commentModel.dropTable();
    await groupUserModel.dropTable();

    console.log('Rollback complete');
}

const args = process.argv.slice(2);
if (args[0] === 'up') {
    up();
} else if (args[0] === 'down') {
    down();
}

export default { up, down };
