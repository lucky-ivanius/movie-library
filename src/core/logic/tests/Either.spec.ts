import { Left, Right, left, right } from '../Either';

describe('Either', () => {
  describe('Left', () => {
    const leftValue = new Left<string, unknown>('error');

    it('should store the given value', () => {
      expect(leftValue.value).toEqual('error');
    });

    it('should have isLeft method return true', () => {
      expect(leftValue.isLeft()).toBeTruthy();
    });

    it('should have isRight method return false', () => {
      expect(leftValue.isRight()).toBeFalsy();
    });
  });

  describe('Right', () => {
    const rightValue = new Right<unknown, string>('success');

    it('should store the given value', () => {
      expect(rightValue.value).toEqual('success');
    });

    it('should have isLeft method return false', () => {
      expect(rightValue.isLeft()).toBeFalsy();
    });

    it('should have isRight method return true', () => {
      expect(rightValue.isRight()).toBeTruthy();
    });
  });

  describe('left', () => {
    it('should create an instance of Left', () => {
      const leftValue = left('error');
      expect(leftValue).toBeInstanceOf(Left);
      expect(leftValue.value).toEqual('error');
    });
  });

  describe('right', () => {
    it('should create an instance of Right', () => {
      const rightValue = right('success');
      expect(rightValue).toBeInstanceOf(Right);
      expect(rightValue.value).toEqual('success');
    });
  });
});
