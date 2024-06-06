import APIError from './APIError.js'

export default class ValidationError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'ValidationError'
        this.code = 400
    }
}
