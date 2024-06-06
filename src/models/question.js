import Model from './model.js';
import databasePool from "../config/database.js";

export default class Question extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'questions';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: 'VARCHAR(255)',
                notNull: true
            },
            description: {
                type: 'TEXT',
                notNull: true
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
            }
        }
    }
}
