import Model from './model.js';
import databasePool from "../config/database.js";

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
            userId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: 'users(id)'
            }
        }
    }
}
