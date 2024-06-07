import Model from "../models/model.js";

export default class EntityService {
    constructor(entity, dto) {
        if (!entity instanceof Model) throw new Error('Entity must be an instance of Model');
        if (!dto instanceof Function) throw new Error('DTO must be a function');

        this.entity = entity;
        this.dto = dto;
    }

    /**
     * @function find
     * @description Find entity by primary key
     * @param {Number} pk
     * @returns {Object} Entity
     * @async
     */
    async find(pk) {
        const record = await this.entity.find(pk);
        return this.dto(record)
    }

    /**
     * @function findAll
     * @description Find all entities
     * @returns {Array} Entities
     * @async
     */
    async findAll() {     
        const { rows, count } = await this.entity.findAll();
        return { rows: rows.map(this.dto), count };
    }

    /**
     * @function paginate
     * @description Paginate entities
     * @param {Object} options
     * @param {Number} options.limit
     * @param {Number} options.page
     * @returns {Object} Paginated entities
     * @async
     */
    async paginate({limit=10, page=1}) {    
        const { rows, count, pages } = await this.entity.paginate({limit, page});
        return { rows: rows.map(this.dto), count, pages }; 
    }

    /**
     * @function create
     * @description Create a record
     * @param {Object} data The data
     * @returns {Object} The record
     * @async
     */
    async create(data) {
        const record = await this.entity.create(data);
        return this.dto(record);
    }

    /**
     * @function update
     * @description Update a record
     * @param {string} pk The primary key
     * @param {Object} data The data
     * @returns {Object} The record
     * @async
     */
    async update(pk, data) {
        const record = await this.entity.update(pk, data);
        return this.dto(record);
    }

    /**
     * @function delete
     * @description Delete a record
     * @param {Number} pk The primary key
     * @async
     */
    async delete(pk) {
        await this.entity.delete(pk);
    }
}
