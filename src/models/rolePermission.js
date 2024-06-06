import Model from './model.js';
import databasePool from "../config/database.js";

import ValidationError from '../errors/ValidationError.js';

const validateRoleName = (roleName) => {
    if (roleName.length === 0) {
        throw new ValidationError('Role name cannot be empty');
    }
}

const validatePermissionName = (permissionName) => {
    if (permissionName.length === 0) {
        throw new ValidationError('Permission name cannot be empty');
    }
}

export default class RolePermission extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'role_permissions';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            roleName: {
                type: 'VARCHAR(255)',
                notNull: true,
                foreignKey: true,
                references: 'roles(name)'
            },
            permissionName: {
                type: 'VARCHAR(255)',
                notNull: true,
                foreignKey: true,
                references: 'permissions(name)'
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
        validateRoleName(data.roleName);
        validatePermissionName(data.permissionName);

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
        if (data.roleName) validateRoleName(data.roleName);
        if (data.permissionName) validatePermissionName(data.permissionName);

        return super.update(pk, data);
    }
}
