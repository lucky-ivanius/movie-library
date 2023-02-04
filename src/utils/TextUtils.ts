import { validate } from 'uuid';

interface ValidateResult {
  isValid: boolean;
  error?: string;
}

export class TextUtil {
  public static isUUID(value: string): boolean {
    return validate(value);
  }

  public static validateUUIDs(values: string[]): ValidateResult {
    const validatedValues = values.map((value) => this.isUUID(value));

    const errIndex = validatedValues.findIndex((value) => value === false);
    if (errIndex !== -1)
      return {
        isValid: false,
        error: `'${values[errIndex]}' at index ${errIndex}`
      };

    return {
      isValid: true
    };
  }
}
