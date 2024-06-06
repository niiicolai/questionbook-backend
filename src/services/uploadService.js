import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import BadArgumentError from '../errors/BadArgumentError.js';
import NotFoundError from '../errors/NotFoundError.js';



export default class UploadService {
    constructor(options = {}) {
        if (!options.path) {
            throw new Error('Path is required');
        }

        this.path = options.path;
    }

    filename(file, uuid, ownerId, type) {
        const { originalname } = file;
        const extension = path.extname(originalname);
        const filename = `${uuid}-owner=${ownerId}-type=${type}${extension}`;
        return filename;
    }

    parseOwner(filename) {
        const owner = filename.match(/owner=(\d+)/);
    
        if (!owner) {
            throw new Error('Owner not found');
        }
    
        return owner[1];
    }
    
    parseType(filename) {
        const type = filename.match(/type=(\w+)/);
    
        if (!type) {
            throw new Error('Type not found');
        }
    
        return type[1];
    }

    async find(filename) {
        if (!filename) {
            throw new BadArgumentError('Filename is required');
        }

        const filepath = path.join(this.path, filename);
        const exists = fs.existsSync(filepath);

        if (!exists) {
            throw new NotFoundError('File not found');
        }

        const ownerId = this.parseOwner(filename);
        const type = this.parseType(filename);
        const file = fs.readFileSync(filepath);

        return { ownerId, type, file };
    }

    async put(file, uuid, ownerId, type) {
        if (!file) {
            throw new BadArgumentError('File is required');
        }

        if (!id) {
            throw new BadArgumentError('ID is required');
        }

        if (!ownerId) {
            throw new BadArgumentError('Owner ID is required');
        }

        if (!type) {
            throw new BadArgumentError('Type is required');
        }

        const { buffer } = file;
        const filename = this.filename(file, uuid, ownerId, type);
        const filepath = path.join(this.path, filename);

        fs.writeFileSync(filepath, buffer);

        return filename;
    }

    async delete(filename) {
        if (!filename) {
            throw new BadArgumentError('Filename is required');
        }

        const filepath = path.join(this.path, filename);
        const exists = fs.existsSync(filepath);

        if (!exists) {
            throw new NotFoundError('File not found');
        }

        fs.unlinkSync(filepath);
    }
}
