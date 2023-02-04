import { AggregateRoot } from '../AggregateRoot';
import { UniqueID } from '../UniqueID';

interface TestAggregateRootProps {
  name: string;
}

class TestAggregateRoot extends AggregateRoot<TestAggregateRootProps> {}

describe('AggregateRoot', () => {
  it('should create an aggregate root with props and id', () => {
    const props = { name: 'Aggregate Root 1' };
    const id = new UniqueID();
    const aggregateRoot = new TestAggregateRoot(props, id);

    expect(aggregateRoot.props).toEqual(props);
    expect(aggregateRoot.id).toEqual(id);
  });

  it('should create an aggregate root with props only', () => {
    const props = { name: 'Aggregate Root 2' };
    const aggregateRoot = new TestAggregateRoot(props);

    expect(aggregateRoot.props).toEqual(props);
    expect(typeof aggregateRoot.id.toValue()).toBe('string');
    expect(aggregateRoot.id.toString().length).toBeGreaterThan(0);
  });

  it('should return true for equal aggregate roots', () => {
    const props = { name: 'Aggregate Root 3' };
    const id = new UniqueID();
    const aggregateRoot1 = new TestAggregateRoot(props, id);
    const aggregateRoot2 = new TestAggregateRoot(props, id);

    expect(aggregateRoot1.equals(aggregateRoot2)).toBe(true);
  });

  it('should return false for unequal aggregate roots', () => {
    const props = { name: 'Aggregate Root 4' };
    const aggregateRoot1 = new TestAggregateRoot(props);
    const aggregateRoot2 = new TestAggregateRoot(props);

    expect(aggregateRoot1.equals(aggregateRoot2)).toBe(false);
  });

  it('should return false for non aggregate root object', () => {
    const props = { name: 'Aggregate Root 5' };
    const aggregateRoot = new TestAggregateRoot(props);

    expect(aggregateRoot.equals()).toBe(false);
  });
});
