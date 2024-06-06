import APIError from './APIError.js'

export default class ForbiddenError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'ForbiddenError'
        this.code = 403
    }
}
