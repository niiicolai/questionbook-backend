import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

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

const validateRoleName = (roleName) => {
    if (roleName.length === 0) {
        throw new ValidationError('Role name cannot be empty');
    }
}

export default class GroupUser extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return '_group_users';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
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
            roleName: {
                type: 'VARCHAR(255)',
                notNull: true,
                foreignKey: true,
                references: 'roles(name)'
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
        validateGroupId(data.groupId);
        validateUserId(data.userId);
        validateRoleName(data.roleName);

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
        if (data.groupId) validateGroupId(data.groupId);
        if (data.userId) validateUserId(data.userId);
        if (data.roleName) validateRoleName(data.roleName);

        return super.update(pk, data);
    }

    async findByIdAndUserId(id, userId) {
        const rows = await this.findWhere({ id, userId });
        const record = rows[0];
        return record;
    }

    async findByGroupIdAndUserId(groupId, userId) {
        const rows = await this.findWhere({ groupId, userId });
        const record = rows[0];
        return record;
    }

    async findByIdAndGroupIdAndUserId(id, groupId, userId) {
        const rows = await this.findWhere({ id, groupId, userId });
        const record = rows[0];
        return record;
    }
}
