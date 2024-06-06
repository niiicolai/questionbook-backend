import Model from './model.js';
import databasePool from "../config/database.js";
import bcrypt from 'bcrypt';
import NotFoundError from '../errors/NotFoundError.js';

export default class User extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'users';
    }

    primaryKeyName() {
        const columns = this.columns();
        for (const column in columns) {
            if (columns[column].primaryKey) {
                return Object.keys(columns)[0];
            }
        }
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: 'VARCHAR(255)',
                notNull: true,
                unique: true
            },
            email: {
                type: 'VARCHAR(255)',
                notNull: true,
                unique: true
            },
            password: {
                type: 'VARCHAR(255)',
                notNull: true
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
        // Hash the password
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

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
        // Hash the password
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return super.update(pk, data);
    }

    async findByEmail(email) {
        const rows = await this.findWhere({ email });
        const record = rows[0];
        if (!record) {
            throw new NotFoundError('User not found');
        }
        return record;
    }

    comparePassword(currentPassword, otherPassword) {
        return bcrypt.compare(otherPassword, currentPassword);
    }
}
