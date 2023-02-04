import { Result } from '../Result';

describe('Result', () => {
  describe('constructor', () => {
    it('should create a success result', () => {
      const result = new Result<string>(true, undefined, 'value');
      expect(result.isSuccess).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(result.error).toBeUndefined();
      expect(result.getValue()).toBe('value');
    });

    it('should create a failure result', () => {
      const result = new Result<string>(false, 'error');
      expect(result.isSuccess).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('error');
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toBe('error');
    });

    it("should throw an error if it's a success result and has an error message", () => {
      expect(() => new Result<string>(true, 'error')).toThrow();
    });

    it("should throw an error if it's a failure result and doesn't have an error message", () => {
      expect(() => new Result<string>(false)).toThrow();
    });
  });

  describe('ok', () => {
    it('should create a success result without a value', () => {
      const result = Result.ok();
      expect(result.isSuccess).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(result.error).toBeUndefined();
      expect(result.getValue()).toBeUndefined();
    });

    it('should create a success result with a value', () => {
      const result = Result.ok<string>('value');
      expect(result.isSuccess).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(result.error).toBeUndefined();
      expect(result.getValue()).toBe('value');
    });
  });

  describe('fail', () => {
    it('should create a failure result with an error message', () => {
      const result = Result.fail<string>('error');
      expect(result.isSuccess).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('error');
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toBe('error');
    });
  });

  describe('combine', () => {
    it('should return the first failure result', () => {
      const results = [Result.ok(), Result.fail('error1'), Result.ok()];
      const result = Result.combine(results);
      expect(result.isSuccess).toBeFalsy();
      expect(result.isFailure).toBeTruthy();
      expect(result.error).toBe('error1');
      expect(() => result.getValue()).toThrow();
      expect(result.errorValue()).toBe('error1');
    });

    it('should return a success result if all results are successful', () => {
      const results = [Result.ok(), Result.ok()];
      const result = Result.combine(results);
      expect(result.isSuccess).toBeTruthy();
      expect(result.isFailure).toBeFalsy();
      expect(result.error).toBeUndefined();
      expect(result.getValue()).toBeUndefined();
    });
  });
});
