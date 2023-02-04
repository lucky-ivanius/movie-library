import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueID } from '../../../core/domain/UniqueID';
import { Guard } from '../../../core/logic/Guard';
import { Result } from '../../../core/logic/Result';

import { ActorCollection } from './actor';
import { AuthorCollection } from './author';

import { MovieId } from './movieId';

interface MovieProps {
  name: string;
  year: number;
  actors: ActorCollection;
  authors: AuthorCollection;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MovieCollection = Movie[];

export class Movie extends AggregateRoot<MovieProps> {
  get movieId(): MovieId {
    return MovieId.create(this._id);
  }

  get name(): string {
    return this.props.name;
  }

  get year(): number {
    return this.props.year;
  }

  get actors(): ActorCollection {
    return this.props.actors;
  }

  get authors(): AuthorCollection {
    return this.props.authors;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt ?? new Date();
  }

  private constructor(props: MovieProps, id?: UniqueID) {
    super(props, id);
  }

  public static create(props: MovieProps, id?: UniqueID): Result<Movie> {
    const propsResult = Guard.combine([
      Guard.againstEmpty(props.name, 'Name'),
      Guard.againstEmpty(props.year, 'Year'),
      Guard.inRange(props.year, 1887, new Date().getFullYear() + 10, 'Year')
    ]);

    if (!propsResult.succeeded) return Result.fail(propsResult.message);

    const movie = new Movie(props, id);

    return Result.ok<Movie>(movie);
  }
}
