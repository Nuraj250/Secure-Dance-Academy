type AppErrorOptions = {
  statusCode: number;
  errorCode: string;
  details?: Record<string, unknown>;
};

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly errorCode: string;

  public readonly details?: Record<string, unknown>;

  constructor(message: string, options: AppErrorOptions) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.errorCode = options.errorCode;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "The request payload is invalid.", details?: Record<string, unknown>) {
    super(message, {
      statusCode: 422,
      errorCode: "VALIDATION_ERROR",
      details,
    });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication is required.") {
    super(message, {
      statusCode: 401,
      errorCode: "AUTHENTICATION_REQUIRED",
    });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You are not allowed to perform this action.") {
    super(message, {
      statusCode: 403,
      errorCode: "FORBIDDEN",
    });
    this.name = "AuthorizationError";
  }
}

export class AccountPendingError extends AppError {
  constructor(message = "The account is not active.") {
    super(message, {
      statusCode: 403,
      errorCode: "ACCOUNT_NOT_ACTIVE",
    });
    this.name = "AccountPendingError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found.") {
    super(message, {
      statusCode: 404,
      errorCode: "NOT_FOUND",
    });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "The requested change conflicts with existing data.") {
    super(message, {
      statusCode: 409,
      errorCode: "CONFLICT",
    });
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(
    message = "Too many requests.",
    details?: Record<string, unknown>,
  ) {
    super(message, {
      statusCode: 429,
      errorCode: "RATE_LIMITED",
      details,
    });
    this.name = "RateLimitError";
  }
}

export class CsrfError extends AppError {
  constructor(message = "The request origin is not allowed.") {
    super(message, {
      statusCode: 403,
      errorCode: "CSRF_VALIDATION_FAILED",
    });
    this.name = "CsrfError";
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "The service is temporarily unavailable.") {
    super(message, {
      statusCode: 503,
      errorCode: "SERVICE_UNAVAILABLE",
    });
    this.name = "ServiceUnavailableError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
