import APIError from './APIError.js'

export default class IncorrectPasswordError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'IncorrectPasswordError'
        this.code = 400
    }
}
