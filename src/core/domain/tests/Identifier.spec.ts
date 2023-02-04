import { Identifier } from '../Identifier';

describe('Identifier', () => {
  it('should create an identifier with value', () => {
    const value = 111;
    const id = new Identifier<number>(value);

    expect(id.toValue()).toEqual(value);
  });

  it('should return true for equal identifiers', () => {
    const value = 222;
    const id1 = new Identifier<number>(value);
    const id2 = new Identifier<number>(value);

    expect(id1.equals(id2)).toBe(true);
  });

  it('should return false for unequal identifiers', () => {
    const id1 = new Identifier<number>(333);
    const id2 = new Identifier<number>(444);

    expect(id1.equals(id2)).toBe(false);
  });

  it('should return false for non-identifier object', () => {
    const id = new Identifier<number>(555);

    expect(id.equals()).toBe(false);
  });

  it('should return string representation of value', () => {
    const value = 666;
    const id = new Identifier<number>(value);

    expect(id.toString()).toBe(String(value));
  });
});
