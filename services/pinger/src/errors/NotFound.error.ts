export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = 'NotFoundError';
  }
}
