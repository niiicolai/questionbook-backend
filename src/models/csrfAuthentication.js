import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

const validateCsrfSecret = (csrfSecret) => {
    if (!csrfSecret) {
        throw new ValidationError('CSRF secret is required');
    }
}

const validateCsrfToken = (csrfToken) => {
    if (!csrfToken) {
        throw new ValidationError('CSRF token is required');
    }
}

const validateUserId = (userId) => {
    if (isNaN(userId)) {
        throw new ValidationError('User ID must be a number');
    }
}

export default class CsrfAuthentication extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'csrf_authentications';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            csrfSecret: {
                type: 'TEXT',
                notNull: true
            },
            csrfToken: {
                type: 'TEXT',
                notNull: true
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
        validateCsrfSecret(data.csrfSecret);
        validateCsrfToken(data.csrfToken);
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
        if (data.csrfSecret) validateCsrfSecret(data.csrfSecret);
        if (data.csrfToken) validateCsrfToken(data.csrfToken);
        if (data.userId) validateUserId(data.userId);

        return super.update(pk, data);
    }

    async findByUserIdAndCsrfToken(userId, csrfToken) {
        const rows = await this.findWhere({ userId, csrfToken });
        const record = rows[0];
        return record;
    }
}
