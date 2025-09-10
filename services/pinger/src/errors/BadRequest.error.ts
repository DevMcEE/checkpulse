export class BadRequestError extends Error {
  constructor(message = 'Bad request') {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
    this.name = 'BadRequestError';
  }
}
