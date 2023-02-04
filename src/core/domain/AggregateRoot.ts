import { Entity } from './Entity';
import { UniqueID } from './UniqueID';

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueID {
    return this._id;
  }
}
