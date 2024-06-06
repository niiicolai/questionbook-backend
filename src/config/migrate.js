import 'dotenv/config'

import Group from '../models/group.js';
import User from '../models/user.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';
import Comment from '../models/comment.js';

const userModel = new User();
const groupModel = new Group();
const questionModel = new Question();
const answerModel = new Answer();
const commentModel = new Comment();

const up = async () => {
    await userModel.createTable();
    await groupModel.createTable();
    await questionModel.createTable();
    await answerModel.createTable();
    await commentModel.createTable();
    
    console.log('Migration complete');
}

const down = async () => {
    await userModel.dropTable();
    await groupModel.dropTable();
    await questionModel.dropTable();
    await answerModel.dropTable();
    await commentModel.dropTable();

    console.log('Rollback complete');
}

const args = process.argv.slice(2);
if (args[0] === 'up') {
    up();
} else if (args[0] === 'down') {
    down();
}

export default { up, down };
