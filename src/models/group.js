import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

const validateName = (name) => {
    if (name.length === 0) {
        throw new ValidationError('Name cannot be empty');
    }
}

const validateDescription = (description) => {
    if (description.length === 0) {
        throw new ValidationError('Description cannot be empty');
    }
}

const validateCoverUrl = (coverUrl) => {
    if (coverUrl.length === 0) {
        throw new ValidationError('Cover URL cannot be empty');
    }
}

export default class Group extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return '_groups';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: 'VARCHAR(255)',
                notNull: true
            },
            description: {
                type: 'VARCHAR(255)',
                notNull: true
            },
            coverUrl: {
                type: 'VARCHAR(255)',
                notNull: true
            },
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
        validateName(data.name);
        validateDescription(data.description);
        validateCoverUrl(data.coverUrl);

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
        if (data.name) validateName(data.name);
        if (data.description) validateDescription(data.description);
        if (data.coverUrl) validateCoverUrl(data.coverUrl);

        return super.update(pk, data);
    }
}
