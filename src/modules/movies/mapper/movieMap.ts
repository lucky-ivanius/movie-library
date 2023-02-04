import { UniqueID } from '../../../core/domain/UniqueID';
import { Mapper } from '../../../core/infrastructure/Mapper';

import { Movie } from '../domain/movie';
import { ActorMap } from './actorMap';
import { AuthorMap } from './authorMap';

export class MovieMap extends Mapper<Movie> {
  private static toProps(movie: Movie) {
    const props = {
      name: movie.name.trim(),
      year: movie.year
    };

    return props;
  }

  public static toPersistence(movie: Movie): any {
    const id = movie.id.toString();
    const props = this.toProps(movie);

    return { id, ...props };
  }

  public static toDomain(raw: any): Movie {
    const movieOrError = Movie.create(
      {
        name: raw.name,
        year: raw.year,
        actors: raw.Actors.map((actor: any) => ActorMap.toDomain(actor)),
        authors: raw.Authors.map((author: any) => AuthorMap.toDomain(author)),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueID(raw.id)
    );
    if (movieOrError.isFailure) console.log(movieOrError.error);

    return movieOrError.getValue() || null;
  }
}
