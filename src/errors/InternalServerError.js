import APIError from './APIError.js'

export default class InternalServerError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'InternalServerError'
        this.code = 500
    }
}
