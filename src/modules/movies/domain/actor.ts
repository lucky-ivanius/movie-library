import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueID } from '../../../core/domain/UniqueID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

import { ActorId } from './actorId';

interface ActorProps {
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ActorCollection = Actor[];

export class Actor extends AggregateRoot<ActorProps> {
  get actorId(): ActorId {
    return ActorId.create(this._id);
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  private constructor(props: ActorProps, id?: UniqueID) {
    super(props, id);
  }

  public static create(props: ActorProps, id?: UniqueID): Result<Actor> {
    const propsResult = Guard.combine([
      Guard.againstEmpty(props.fullName, 'Name'),
      Guard.greaterThan(props.fullName?.length, 2, 'Name length')
    ]);

    if (!propsResult.succeeded) return Result.fail(propsResult.message);

    const actor = new Actor(props, id);

    return Result.ok<Actor>(actor);
  }
}
