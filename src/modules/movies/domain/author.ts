import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueID } from '../../../core/domain/UniqueID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

import { AuthorId } from './authorId';

interface AuthorProps {
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AuthorCollection = Author[];

export class Author extends AggregateRoot<AuthorProps> {
  get authorId(): AuthorId {
    return AuthorId.create(this._id);
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

  private constructor(props: AuthorProps, id?: UniqueID) {
    super(props, id);
  }

  public static create(props: AuthorProps, id?: UniqueID): Result<Author> {
    const propsResult = Guard.combine([
      Guard.againstEmpty(props.fullName, 'Name'),
      Guard.greaterThan(props.fullName?.length, 2, 'Name length')
    ]);

    if (!propsResult.succeeded) return Result.fail(propsResult.message);

    const author = new Author(props, id);

    return Result.ok<Author>(author);
  }
}
