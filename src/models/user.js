import Model from './model.js';
import databasePool from "../config/database.js";
import bcrypt from 'bcrypt';
import ValidationError from '../errors/ValidationError.js';

const validateEmail = (email) => {
    // ^ asserts the position at the start of the string.
    // [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // @ matches the @ symbol.
    // [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // \. matches a literal dot.
    // [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // $ asserts the position at the end of the string.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email address');
    }
}

const validateUsername = (username) => {
    if (username.length === 0) {
        throw new ValidationError('Username cannot be empty');
    }
}

const validatePassword = (password) => {
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
    }
}

const hashPassword = async (password) => {
    if (!password) throw new ValidationError('Password is required');

    return await bcrypt.hash(password, 10);
}

export default class User extends Model {
    constructor(db = databasePool) {
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
        validateEmail(data.email);
        validateUsername(data.username);
        validatePassword(data.password);
        data.password = await hashPassword(data.password);

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
        if (data.email) validateEmail(data.email);
        if (data.username) validateUsername(data.username);
        if (data.password) {
            validatePassword(data.password);
            data.password = await hashPassword(data.password);
        }

        return super.update(pk, data);
    }

    async findByEmail(email) {
        const rows = await this.findWhere({ email });
        const record = rows[0];
        return record;
    }

    comparePassword(currentPassword, otherPassword) {
        return bcrypt.compare(otherPassword, currentPassword);
    }
}
