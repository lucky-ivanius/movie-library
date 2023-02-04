import { UniqueID } from '../UniqueID';

describe('UniqueID', () => {
  it('should create a unique identifier with string or number value', () => {
    const stringId = new UniqueID('aaa');
    expect(stringId.toValue()).toEqual('aaa');

    const numberId = new UniqueID(111);
    expect(numberId.toValue()).toEqual(111);
  });

  it('should create a unique identifier with generated UUID if no value provided', () => {
    const id = new UniqueID();

    expect(typeof id.toValue()).toBe('string');
    expect(id.toString().length).toBeGreaterThan(0);
  });

  it('should return true for equal unique identifiers', () => {
    const value = 'bbb';
    const id1 = new UniqueID(value);
    const id2 = new UniqueID(value);

    expect(id1.equals(id2)).toBe(true);
  });

  it('should return false for unequal unique identifiers', () => {
    const id1 = new UniqueID('ccc');
    const id2 = new UniqueID('ddd');

    expect(id1.equals(id2)).toBe(false);
  });

  it('should return false for non-unique identifier object', () => {
    const id = new UniqueID('eee');

    expect(id.equals()).toBe(false);
  });

  it('should return string representation of value', () => {
    const value = 'fff';
    const id = new UniqueID(value);

    expect(id.toString()).toBe(value);
  });
});
