import Model from './model.js';
import databasePool from "../config/database.js";

export default class Comment extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'comments';
    }

    // Define the columns
    columns() {
        return {
            id: {
                type: 'INT',
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: 'TEXT',
                notNull: true
            },
            answerId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: 'answers(id)'
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
