import { Guard } from '../Guard';

describe('Guard', () => {
  describe('combine', () => {
    it('should return success if all guard results succeeded', () => {
      const guardResults = [{ succeeded: true }, { succeeded: true }];
      const result = Guard.combine(guardResults);
      expect(result.succeeded).toBeTruthy();
    });

    it('should return the first failed guard result', () => {
      const guardResults = [
        { succeeded: true },
        { succeeded: false, message: 'failed' },
        { succeeded: true }
      ];
      const result = Guard.combine(guardResults);
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toBe('failed');
    });
  });

  describe('againstEmpty', () => {
    it('should return success if argument is not null or undefined', () => {
      const argument = 'not null';
      const result = Guard.againstEmpty(argument, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if argument is null', () => {
      const argument = null;
      const result = Guard.againstEmpty(argument, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });

    it('should return failure if argument is undefined', () => {
      let argument;
      const result = Guard.againstEmpty(argument, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });

    it('should return failure if argument is empty string', () => {
      const argument = '';
      const result = Guard.againstEmpty(argument, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('againstEmptyBulk', () => {
    it('should return success if all arguments are not null or undefined', () => {
      const args = [
        { argument: 'not null', argumentName: 'arg1' },
        { argument: 'not null', argumentName: 'arg2' }
      ];
      const result = Guard.againstEmptyBulk(args);
      expect(result.succeeded).toBeTruthy();
    });

    it('should return the first failed argument', () => {
      const args = [
        { argument: 'not null', argumentName: 'arg1' },
        { argument: null, argumentName: 'arg2' },
        { argument: 'not null', argumentName: 'arg3' }
      ];
      const result = Guard.againstEmptyBulk(args);
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('arg2');
    });
  });

  describe('isOneOf', () => {
    it('should return success if value is in validValues', () => {
      const value = 'valid';
      const validValues = ['valid', 'other'];
      const result = Guard.isOneOf(value, validValues, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if value is not in validValues', () => {
      const value = 'invalid';
      const validValues = ['valid', 'other'];
      const result = Guard.isOneOf(value, validValues, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('inRange', () => {
    it('should return success if num is between min and max', () => {
      const num = 0.5;
      const min = 0;
      const max = 1;
      const result = Guard.inRange(num, min, max, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if num is not between min and max', () => {
      const num = 2;
      const min = 0;
      const max = 1;
      const result = Guard.inRange(num, min, max, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('allInRange', () => {
    it('should return success if numbers is between min and max', () => {
      const numbers = [0, 0.5];
      const min = 0;
      const max = 1;
      const result = Guard.allInRange(numbers, min, max, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if any number in numbers is not between min and max', () => {
      const numbers = [0, 99];
      const min = 0;
      const max = 1;
      const result = Guard.allInRange(numbers, min, max, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('greaterThan', () => {
    it('should return success if num is greater than', () => {
      const num = 10;
      const min = 2;
      const result = Guard.greaterThan(num, min, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if num is not greater than', () => {
      const num = 1;
      const min = 2;
      const result = Guard.greaterThan(num, min, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('greaterThanOrEqual', () => {
    it('should return success if num is equal', () => {
      const num = 2;
      const min = 2;
      const result = Guard.greaterThanOrEqual(num, min, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return success if num is greater than', () => {
      const num = 10;
      const min = 2;
      const result = Guard.greaterThanOrEqual(num, min, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if num is not equal or greater than', () => {
      const num = 1;
      const min = 2;
      const result = Guard.greaterThanOrEqual(num, min, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('lessThan', () => {
    it('should return success if num is less than', () => {
      const num = 2;
      const max = 10;
      const result = Guard.lessThan(num, max, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if num is not less than', () => {
      const num = 20;
      const max = 10;
      const result = Guard.lessThan(num, max, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });

  describe('lessThanOrEqual', () => {
    it('should return success if num is equal', () => {
      const num = 10;
      const max = 10;
      const result = Guard.lessThanOrEqual(num, max, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return success if num is less than', () => {
      const num = 2;
      const max = 10;
      const result = Guard.lessThanOrEqual(num, max, 'argument');
      expect(result.succeeded).toBeTruthy();
    });

    it('should return failure if num is not less than', () => {
      const num = 20;
      const max = 10;
      const result = Guard.lessThanOrEqual(num, max, 'argument');
      expect(result.succeeded).toBeFalsy();
      expect(result.message).toContain('argument');
    });
  });
});
