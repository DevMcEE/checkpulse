export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.name = 'UnauthorizedError';
  }
}
