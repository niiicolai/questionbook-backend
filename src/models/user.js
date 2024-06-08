import Model from './model.js';
import databasePool from "../config/database.js";
import bcrypt from 'bcrypt';
import ValidationError from '../errors/ValidationError.js';

const validateEmail = (email) => {
    // 1. ^ asserts the position at the start of the string.
    // 2. [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // 3. @ matches the @ symbol.
    // 4. [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // 5. \. matches a literal dot.
    // 6. [^\s@]+ matches one or more characters that are not whitespace (\s) or the @ symbol.
    // 7. $ asserts the position at the end of the string.
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

const validatePassword = (password, username, email) => {
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
    }

    // (?=.*[a-z]) asserts that the password contains at least one lowercase letter.
    if (!/(?=.*[a-z])/.test(password)) {
        throw new ValidationError('Password must contain at least one lowercase letter');
    }

    // (?=.*[A-Z]) asserts that the password contains at least one uppercase letter.
    if (!/(?=.*[A-Z])/.test(password)) {
        throw new ValidationError('Password must contain at least one uppercase letter');
    }

    // (?=.*[0-9]) asserts that the password contains at least one digit.
    if (!/(?=.*[0-9])/.test(password)) {
        throw new ValidationError('Password must contain at least one digit');
    }

    // (?=.*[!@#$%^&*]) asserts that the password contains at least one special character.
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
        throw new ValidationError('Password must contain at least one special character');
    }

    if (password.includes(username)) {
        throw new ValidationError('Password cannot contain the username');
    }

    if (password.includes(email)) {
        throw new ValidationError('Password cannot contain the email');
    }
}

const hashPassword = async (password) => {
    if (!password) throw new ValidationError('Password is required');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
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
            },
            roleName: {
                type: 'VARCHAR(255)',
                notNull: true,
                default: "'User'",
                foreignKey: true,
                references: 'roles(name)'
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
        validateEmail(data.email);
        validateUsername(data.username);
        validatePassword(data.password, data.username, data.email);
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
            const record = await this.find(pk);
            const { username, email } = record;
            validatePassword(data.password, username, email);
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
