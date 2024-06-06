import APIError from './APIError.js'

export default class UnauthorizedError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'UnauthorizedError'
        this.code = 401
    }
}
