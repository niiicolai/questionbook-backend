import 'dotenv/config'

import seedData from '../data/seedData.js';

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

    console.log('Seeding complete');
}

const down = async () => {
    await new Group().deleteAll();
    await new User().deleteAll();
    await new Question().deleteAll();
    await new Answer().deleteAll();
    await new Comment().deleteAll();

    console.log('Rollback complete');
}

const args = process.argv.slice(2);
if (args[0] === 'up') {
    up();
} else if (args[0] === 'down') {
    down();
}

export default { up, down };
