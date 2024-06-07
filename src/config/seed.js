import 'dotenv/config'

import seedData from '../data/seedData.js';

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

    await Promise.all(
        seedData.roles.map(async role => {
            return await roleModel.create(role);
        }
    ));

    await Promise.all(
        seedData.permissions.map(async permission => {
            return await permissionModel.create(permission);
        }
    ));

    await Promise.all(
        seedData.rolePermissions.map(async rolePermission => {
            return await rolePermissionModel.create(rolePermission);
        }
    ));

    await Promise.all(
        seedData.users.map(async user => {
            return await userModel.create(user);
        }
    ));

    await Promise.all(
        seedData.groups.map(async group => {
            return await groupModel.create(group);
        }
    ));

    await Promise.all(
        seedData.questions.map(async question => {
            return await questionModel.create(question);
        }
    ));

    await Promise.all(
        seedData.answers.map(async answer => {
            return await answerModel.create(answer);
        }
    ));

    await Promise.all(
        seedData.comments.map(async comment => {
            return await commentModel.create(comment);
        }
    ));

    await Promise.all(
        seedData.groupUsers.map(async groupUser => {
            return await groupUserModel.create(groupUser);
        }
    ));

    console.log('Seeding complete');
}

const down = async () => {
    await groupUserModel.deleteAll();
    await commentModel.deleteAll();
    await answerModel.deleteAll();
    await questionModel.deleteAll();
    await groupModel.deleteAll();
    await userModel.deleteAll();
    await rolePermissionModel.deleteAll();
    await permissionModel.deleteAll();
    await roleModel.deleteAll();

    console.log('Rollback complete');
}

const args = process.argv.slice(2);
if (args[0] === 'up') {
    up();
} else if (args[0] === 'down') {
    down();
}

export default { up, down };
