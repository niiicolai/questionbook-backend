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

export default class Permission extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'permissions';
    }

    // Define the columns
    columns() {
        return {
            name: {
                type: 'VARCHAR(255)',
                primaryKey: true,
                notNull: true
            },
            description: {
                type: 'VARCHAR(255)',
                notNull: true
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
        validateName(data.name);
        validateDescription(data.description);

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

        return super.update(pk, data);
    }
}
