import APIError from './APIError.js'

export default class BadArgumentError extends APIError {
    constructor(message) {
        super(message)
        this.name = 'BadArgumentError'
        this.code = 400
    }
}
