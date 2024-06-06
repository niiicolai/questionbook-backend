import APIError from './APIError.js'

export default class NotFoundError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
        this.code = 404
    }
}
