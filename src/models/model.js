import BadArgumentError from "../errors/BadArgumentError.js";
import NotFoundError from "../errors/NotFoundError.js";

const debugMode = process.env.DEBUG;

export default class Model {
    constructor(db) {
        this.db = db;
    }

    /**
     * @function tableName
     * @description Get the table name
     * @returns {String} The table name
     * @throws {Error} The method must be implemented
     */
    tableName() {
        throw new Error('Model must implement tableName method');
    }

    /**
     * @function primaryKeyName
     * @description Get the primary key name
     * @returns {String} The primary key name
     */
    primaryKeyName() {
        const columns = this.columns();
        const primaryKeys = Object.keys(columns).filter(key => columns[key].primaryKey);
        if (primaryKeys.length > 0) {
            return primaryKeys[0];
        } else {
            throw new Error('Table must have a primary key');
        }
    }

    /**
     * @function columns
     * @description Get the columns
     * @returns {Object} The columns
     * @throws {Error} The method must be implemented
     */
    columns() {
        throw new Error('Model must implement columns method');
    }

    /**
     * @function createTable
     * @description Create the table in the database
     * @param {Object} databasePool The database pool
     * @returns {void}
     * @async
     */
    async createTable() {
        // Get the table name
        const tableName = this.tableName();

        // Get the columns
        const columns = this.columns();

        // Create the query
        let query = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (`;

        // Add the columns to the query, and
        // join them with a comma
        query += Object.keys(columns).map(key => {
            let columnQuery = `${key} ${columns[key].type}`;

            if (columns[key].notNull) {
                columnQuery += ' NOT NULL';
            }

            if (columns[key].autoIncrement) {
                columnQuery += ' AUTO_INCREMENT';
            }

            if (columns[key].unique) {
                columnQuery += ' UNIQUE';
            }

            return columnQuery;
        }).join(', ');

        // Add the primary key to the query
        const primaryKeys = Object.keys(columns).filter(key => columns[key].primaryKey);
        if (primaryKeys.length > 0) {
            query += ', ';

            query += `PRIMARY KEY (${primaryKeys.join(', ')})`;
        } else {
            // If there is no primary key, throw an error
            throw new Error('Table must have a primary key');
        }

        // Add the foreign keys to the query
        const foreignKeys = Object.keys(columns).filter(key => columns[key].foreignKey);
        if (foreignKeys.length > 0) {
            query += ', ';

            query += foreignKeys.map(key => {
                let columnQuery = `FOREIGN KEY (${key}) REFERENCES ${columns[key].references}`;

                return columnQuery;
            }).join(', ');
        }

        // Close the query
        query += ')';

        // Log the query to the console
        if (debugMode) console.log(query);

        // Run the query
        await this.db
            .query(query)
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * @function dropTable
     * @description Drop the table in the database
     * @param {Object} databasePool The database pool
     * @returns {void}
     * @async
     */
    async dropTable() {
        // Get the table name
        const tableName = this.tableName();

        // Create the query
        const query = `DROP TABLE IF EXISTS ${tableName}`;

        // Log the query to the console
        if (debugMode) console.log(query);

        // Run the query
        await this.db
            .query(query)
            .catch((error) => {
                console.error(error);
            });
    }

    /**
     * @function find
     * @description Find a record by primary key
     * @param {Number} pk The primary key
     * @param {Object} where The where clause
     * @returns {Object} The record
     * @throws {BadArgumentError} Primary key is required
     * @throws {NotFoundError} Record not found
     * @async
     */
    async find(pk, where = null) {
        if (!pk) {
            throw new BadArgumentError('Primary key is required');
        }

        const tableName = this.tableName();
        const pkName = this.primaryKeyName();
        const query = `SELECT * FROM ${tableName} WHERE ${pkName} = ?`;
        if (where) {
            const whereKeys = Object.keys(where);
            const whereQuery = whereKeys.map(key => {
                return `${key} = ?`;
            }).join(' AND ');
            query += ` AND ${whereQuery}`;
        }

        if (debugMode) console.log(query, [pk]);
        const [rows] = await this.db.query(query, [pk]);
        const record = rows[0];
        if (!record) {
            throw new NotFoundError(`${tableName} with ${pkName} ${pk} not found`);
        }

        return record;
    }

    /**
     * @function findWhere
     * @description Find a record by primary key
     * @param {Object} where The where clause
     * @returns {Object} The record
     * @throws {BadArgumentError} Where clause is required
     * @async
     */
    async findWhere(where) {
        if (!where) {
            throw new BadArgumentError('Where clause is required');
        }

        const tableName = this.tableName();
        let query = `SELECT * FROM ${tableName}`;
        const whereKeys = Object.keys(where);
        const whereQuery = whereKeys.map(key => {
            return `${key} = ?`;
        }).join(' AND ');
        const values = Object.values(where);
        
        query += ` WHERE ${whereQuery}`;
        if (debugMode) console.log(query, values);
        const [rows] = await this.db.query(query, values);
        return rows;
    }

    /**
     * @function findAll
     * @description Find all records
     * @returns {Object} The records
     * @async
     */
    async findAll() {
        const tableName = this.tableName();
        const selectQuery = `SELECT * FROM ${tableName}`;
        const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
        if (debugMode) {
            console.log(selectQuery);
            console.log(countQuery);
        }
        const [rows] = await this.db.query(selectQuery);
        const _count = await this.db.query(countQuery);
        const count = _count[0][0].count;
        
        return { rows, count }
    }

    /**
     * @function paginate
     * @description Paginate the records
     * @param {Object} options The options
     * @param {Number} options.limit The limit
     * @param {Number} options.page The page
     * @returns {Object} The records
     * @throws {BadArgumentError} Limit is required and must be a number
     * @throws {BadArgumentError} Page is required and must be a number
     * @throws {BadArgumentError} Limit must be greater than 0
     * @throws {BadArgumentError} Page must be greater than 0
     * @async
     */
    async paginate({ limit = 10, page = 1 }) {
        if (!limit || isNaN(limit)) {
            throw new BadArgumentError('Limit is required and must be a number');
        } else {
            limit = parseInt(limit);
        }

        if (!page || isNaN(page)) {
            throw new BadArgumentError('Page is required and must be a number');
        } else {
            page = parseInt(page);
        }

        if (limit < 1) {
            throw new BadArgumentError('Limit must be greater than 0');
        }

        if (page < 1) {
            throw new BadArgumentError('Page must be greater than 0');
        }

        const offset = (page - 1) * limit;
        const tableName = this.tableName();
        const selectQuery = `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
        if (debugMode) {
            console.log(selectQuery, [limit, offset]);
            console.log(countQuery);
        }
        const [rows] = await this.db.query(selectQuery, [limit, offset]);
        const _count = await this.db.query(countQuery);
        const count = _count[0][0].count;
        const pages = Math.ceil(count / limit);
        return { rows, pages, count }
    }

    /**
     * @function create
     * @description Create a record
     * @param {Object} data The data
     * @returns {Object} The record
     * @async
     */
    async create(data) {
        const tableName = this.tableName();
        const props = Object.keys(this.columns()).map(key => {
            const value = data[key];
            return { key, value }
        }).filter(({ key, value }) => {
            return value !== undefined;
        });

        const columns = props.map(({ key }) => key);
        const values = props.map(({ value }) => value);
        const query = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
        if (debugMode) console.log(query, values);
        const [result] = await this.db.execute(query, values);
        if (!result.insertId) return null;
        return this.find(result.insertId);
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
        const tableName = this.tableName();
        const pkName = this.primaryKeyName();
        const entity = await this.find(pk);

        const columns = this.columns();
        const props = Object.keys(columns).map(key => {
            return `${key} = ?`;
        })
        const values = Object.keys(columns).map(key => {
            return data[key] || entity[key];
        })

        const query = `UPDATE ${tableName} SET ${props.join(', ')} WHERE ${pkName} = ?`;
        if (debugMode) console.log(query, [...values, pk]);
        await this.db.execute(query, [...values, pk]);
        return this.find(pk);
    }

    /**
     * @function delete
     * @description Delete a record
     * @param {Number} pk The primary key
     * @returns {void}
     * @async
     */
    async delete(pk) {
        const tableName = this.tableName();
        const pkName = this.primaryKeyName();
        const query = `DELETE FROM ${tableName} WHERE ${pkName} = ?`;
        if (debugMode) console.log(query, [pk]);
        await this.db.execute(query, [pk]);
    }

    /**
     * @function deleteAll
     * @description Delete all records
     * @returns {void}
     */
    async deleteAll() {
        const tableName = this.tableName();
        const query = `DELETE FROM ${tableName}`;
        if (debugMode) console.log(query);
        await this.db.execute(query);
    }
}
