export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class DomainConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'DOMAIN_CONFLICT');
    this.name = 'DomainConflictError';
  }
}

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}
