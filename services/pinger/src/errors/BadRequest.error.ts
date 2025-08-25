import { StatusCodeError } from "./StatusCodeError.error";

export class BadRequestError extends StatusCodeError {
    constructor (message = "Bad request"){
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}