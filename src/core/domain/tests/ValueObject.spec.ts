import { ValueObject } from '../ValueObject';

interface TestValueObjectProps {
  prop1: string;
  prop2: number;
}

class TestValueObject extends ValueObject<TestValueObjectProps> {}

describe('ValueObject', () => {
  it('should create a value object with props', () => {
    const props: TestValueObjectProps = { prop1: '111', prop2: 111 };
    const valueObject = new TestValueObject(props);

    expect(valueObject.props).toEqual(props);
  });

  it('should return true for equal value objects', () => {
    const props: TestValueObjectProps = { prop1: '222', prop2: 222 };
    const valueObject1 = new TestValueObject(props);
    const valueObject2 = new TestValueObject(props);

    expect(valueObject1.equals(valueObject2)).toBe(true);
  });

  it('should return false for unequal value objects', () => {
    const props1: TestValueObjectProps = { prop1: '333', prop2: 333 };
    const props2: TestValueObjectProps = { prop1: '444', prop2: 444 };
    const valueObject1 = new TestValueObject(props1);
    const valueObject2 = new TestValueObject(props2);

    expect(valueObject1.equals(valueObject2)).toBe(false);
  });

  it('should return false for non-value object object', () => {
    const props: TestValueObjectProps = { prop1: '555', prop2: 555 };
    const valueObject = new TestValueObject(props);

    expect(valueObject.equals()).toBe(false);
  });
});
