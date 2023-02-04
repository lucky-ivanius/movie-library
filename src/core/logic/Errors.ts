import { Result } from './Result';
import { UseCaseError } from './UseCaseError';

export class UnexpectedError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Unexpected error occured.`
    } as UseCaseError);
  }
}

export class InvalidId extends Result<UseCaseError> {
  constructor(message?: string) {
    super(false, {
      message: message ?? `Invalid ID`
    } as UseCaseError);
  }
}

export class BadRequest extends Result<UseCaseError> {
  constructor(message: string) {
    super(false, {
      message
    } as UseCaseError);
  }
}

export class NotFound extends Result<UseCaseError> {
  constructor(id: string, argumentName: string) {
    super(false, {
      message: `${argumentName} with id ${id} was not found`
    } as UseCaseError);
  }
}

export class UnsuccessfulOperation extends Result<UseCaseError> {
  constructor(message: string) {
    super(false, {
      message
    } as UseCaseError);
  }
}
