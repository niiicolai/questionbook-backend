

export default class APIError extends Error {
    constructor(message, code) {
        super(message)
        this.name = 'APIError'
        this.code = code
    }
}
