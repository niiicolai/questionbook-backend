import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

const validateDescription = (description) => {
    if (description.length === 0) {
        throw new ValidationError('Description cannot be empty');
    }
}

const validateQuestionId = (questionId) => {
    if (isNaN(questionId)) {
        throw new ValidationError('Question ID must be a number');
    }
}

const validateUserId = (userId) => {
    if (isNaN(userId)) {
        throw new ValidationError('User ID must be a number');
    }
}

export default class Answer extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'answers';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: 'TEXT',
                notNull: true
            },
            questionId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: 'questions(id)'
            },
            userId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: 'users(id)'
            },
            createdAt: {
                type: 'TIMESTAMP',
                notNull: true,
                default: 'CURRENT_TIMESTAMP'
            },
            updatedAt: {
                type: 'TIMESTAMP',
                notNull: true,
                default: 'CURRENT_TIMESTAMP'
            }
        }
    }

    /**
     * @function create
     * @description Create a record
     * @param {Object} data The data
     * @returns {Object} The record
     * @async
     */
    async create(data) {
        validateDescription(data.description);
        validateQuestionId(data.questionId);
        validateUserId(data.userId);

        return super.create(data);
    }

    /**
     * @function update
     * @description Update a record
     * @param {Number} pk The primary key
     * @param {Object} data The data
     * @returns {Object} The record
     * @async
     */
    async update(pk, data) {
        if (data.description) validateDescription(data.description);
        if (data.questionId) validateQuestionId(data.questionId);
        if (data.userId) validateUserId(data.userId);

        return super.update(pk, data);
    }
}
