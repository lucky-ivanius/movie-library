import { UniqueID } from '../UniqueID';
import { Entity } from '../Entity';

interface TestEntityProps {
  name: string;
}

class TestEntity extends Entity<TestEntityProps> {}

describe('Entity', () => {
  it('should create an entity with props and id', () => {
    const props = { name: 'Entity 1' };
    const id = new UniqueID();
    const entity = new TestEntity(props, id);

    expect(entity.props).toEqual(props);
  });

  it('should create an entity with props only', () => {
    const props = { name: 'Entity 2' };
    const entity = new TestEntity(props);

    expect(entity.props).toEqual(props);
  });

  it('should return true for equal entities', () => {
    const props = { name: 'Entity 3' };
    const id = new UniqueID();
    const entity1 = new TestEntity(props, id);
    const entity2 = new TestEntity(props, id);

    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should return false for unequal entities', () => {
    const props = { name: 'Entity 4' };
    const entity1 = new TestEntity(props);
    const entity2 = new TestEntity(props);

    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should return false for non-entity object', () => {
    const props = { name: 'Entity 5' };
    const entity = new TestEntity(props);

    expect(entity.equals()).toBe(false);
  });
});
