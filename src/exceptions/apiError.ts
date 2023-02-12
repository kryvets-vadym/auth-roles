export class ApiError extends Error {
  status;
  errors;

  constructor(status: any, message: any, errors = {}) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorised!')
  }

  static BadRequest(message: string, errors?: any) {
    return new ApiError(400, message, errors)
  }

  static NotFound() {
    return new ApiError(404, 'Not Found!');
  }
}
