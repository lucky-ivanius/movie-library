export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    const failedResult = guardResults.find(
      (result) => result.succeeded === false
    );
    if (failedResult) return failedResult;

    return { succeeded: true };
  }

  public static againstEmpty(
    argument: any,
    argumentName: string
  ): IGuardResult {
    if (argument === null || argument === undefined || argument === '')
      return {
        succeeded: false,
        message: `${argumentName} should not be empty.`
      };

    return { succeeded: true };
  }

  public static againstEmptyBulk(args: GuardArgumentCollection): IGuardResult {
    const failedResult = args
      .map((arg) => this.againstEmpty(arg.argument, arg.argumentName))
      .find((result) => result.succeeded === false);
    if (failedResult) return failedResult;

    return { succeeded: true };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): IGuardResult {
    if (validValues.includes(value)) {
      return { succeeded: true };
    }

    return {
      succeeded: false,
      message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
        validValues
      )}. Got "${value}".`
    };
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const isInRange = min <= num && num <= max;
    if (!isInRange)
      return {
        succeeded: false,
        message: `${argumentName} is not within range ${min} to ${max}.`
      };

    return { succeeded: true };
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const failedResult = numbers
      .map((number) => this.inRange(number, min, max, argumentName))
      .find((result) => result.succeeded === false);
    if (failedResult)
      return {
        succeeded: false,
        message: `${argumentName} is not within the range.`
      };

    return { succeeded: true };
  }

  public static greaterThan(
    num: number,
    min: number,
    argumentName: string
  ): IGuardResult {
    const isGreaterThan = num > min;
    if (!isGreaterThan)
      return {
        succeeded: false,
        message: `${argumentName} must be greater than ${min}.`
      };

    return { succeeded: true };
  }

  public static greaterThanOrEqual(
    num: number,
    min: number,
    argumentName: string
  ): IGuardResult {
    const isGreaterThanOrEqual = num >= min;
    if (!isGreaterThanOrEqual)
      return {
        succeeded: false,
        message: `${argumentName} must be equal or greater than ${min}.`
      };

    return { succeeded: true };
  }

  public static lessThan(
    num: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const isLessThan = num < max;
    if (!isLessThan)
      return {
        succeeded: false,
        message: `${argumentName} must be less than ${max}.`
      };

    return { succeeded: true };
  }

  public static lessThanOrEqual(
    num: number,
    max: number,
    argumentName: string
  ): IGuardResult {
    const isLessThanOrEqual = num <= max;
    if (!isLessThanOrEqual)
      return {
        succeeded: false,
        message: `${argumentName} must be equal or less than ${max}.`
      };

    return { succeeded: true };
  }
}
