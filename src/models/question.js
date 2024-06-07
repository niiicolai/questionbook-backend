import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

const validateTitle = (title) => {
    if (title.length === 0) {
        throw new ValidationError('Title cannot be empty');
    }
}

const validateDescription = (description) => {
    if (description.length === 0) {
        throw new ValidationError('Description cannot be empty');
    }
}

const validateGroupId = (groupId) => {
    if (isNaN(groupId)) {
        throw new ValidationError('Group ID must be a number');
    }
}

const validateUserId = (userId) => {
    if (isNaN(userId)) {
        throw new ValidationError('User ID must be a number');
    }
}

export default class Question extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'questions';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: 'VARCHAR(255)',
                notNull: true
            },
            description: {
                type: 'TEXT',
                notNull: true
            },
            groupId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: '_groups(id)'
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
        validateTitle(data.title);
        validateDescription(data.description);
        validateGroupId(data.groupId);
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
        if (data.title) validateTitle(data.title);
        if (data.description) validateDescription(data.description);
        if (data.groupId) validateGroupId(data.groupId);
        if (data.userId) validateUserId(data.userId);

        return super.update(pk, data);
    }
}
