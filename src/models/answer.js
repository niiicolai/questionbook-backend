import Model from './model.js';
import databasePool from "../config/database.js";

export default class Answer extends Model {
    constructor(db=databasePool) {
        super(db);
    }

    // Define the table name
    tableName() {
        return 'answers';
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
            questionId: {
                type: 'INT',
                notNull: true,
                foreignKey: true,
                references: 'questions(id)'
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
