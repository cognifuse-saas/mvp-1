export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class AuthError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError('UNKNOWN_ERROR', error.message);
  }

  return new APIError(
    'UNKNOWN_ERROR',
    'An unexpected error occurred'
  );
};

export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
}; 