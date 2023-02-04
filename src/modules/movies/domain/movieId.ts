import { Entity } from '../../../core/domain/Entity';
import { UniqueID } from '../../../core/domain/UniqueID';

export class MovieId extends Entity<any> {
  get id(): UniqueID {
    return this._id;
  }

  private constructor(id?: UniqueID) {
    super(undefined, id);
  }

  public static create(id?: UniqueID): MovieId {
    return new MovieId(id);
  }
}
