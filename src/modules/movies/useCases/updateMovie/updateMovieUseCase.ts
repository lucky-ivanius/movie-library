import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Movie } from '../../domain/movie';
import { IMovieRepo } from '../../repos/movieRepo';
import { UpdateMovieDTO } from './updateMovieDTO';
import { TextUtil } from '../../../../utils/TextUtils';
import { IActorRepo } from '../../repos/actorRepo';
import { IAuthorRepo } from '../../repos/authorRepo';
import { ActorCollection } from '../../domain/actor';
import { AuthorCollection } from '../../domain/author';

type Errors = InvalidId | BadRequest | NotFound;

type MovieResult = Either<Errors, Result<Movie>>;

export class UpdateMovieUseCase
  implements UseCase<UpdateMovieDTO, MovieResult>
{
  private movieRepo: IMovieRepo;
  private actorRepo: IActorRepo;
  private authorRepo: IAuthorRepo;

  constructor(
    movieRepo: IMovieRepo,
    actorRepo: IActorRepo,
    authorRepo: IAuthorRepo
  ) {
    this.movieRepo = movieRepo;
    this.actorRepo = actorRepo;
    this.authorRepo = authorRepo;
  }

  private async getActors(actorIds: string[]) {
    const actors = await this.actorRepo.findActorByIds(actorIds);
    return actors;
  }

  private async getAuthors(authorIds: string[]) {
    const authors = await this.authorRepo.findAuthorByIds(authorIds);
    return authors;
  }

  private overrideActor(
    actors: ActorCollection,
    newActors: ActorCollection,
    removeActors: ActorCollection
  ): ActorCollection {
    return actors.concat(newActors).filter((actor) => {
      const ids = removeActors.map((removeActor) =>
        removeActor.actorId.id.toString()
      );
      return !ids.includes(actor.actorId.id.toString());
    });
  }

  private overrideAuthor(
    authors: AuthorCollection,
    newAuthors: AuthorCollection,
    removeAuthors: AuthorCollection
  ): AuthorCollection {
    return authors.concat(newAuthors).filter((author) => {
      const ids = removeAuthors.map((removeAuthor) =>
        removeAuthor.authorId.id.toString()
      );
      return !ids.includes(author.authorId.id.toString());
    });
  }

  async execute(input: UpdateMovieDTO) {
    const { id, data } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Movie ID: ${id}`)) as MovieResult;

    const movie = await this.movieRepo.findMovieById(id);
    if (!movie) return left(new NotFound(id, 'Movie')) as MovieResult;

    const actors = (data.actors?.new ?? []).concat(data.actors?.removes ?? []);
    const authors = (data.authors?.new ?? []).concat(
      data.authors?.removes ?? []
    );

    const validateActors = TextUtil.validateUUIDs(actors);
    if (!validateActors.isValid)
      return left(
        new InvalidId(`Invalid Actor ID: ${validateActors.error}`)
      ) as MovieResult;

    const validateAuthors = TextUtil.validateUUIDs(authors);
    if (!validateAuthors.isValid)
      return left(
        new InvalidId(`Invalid Author ID: ${validateAuthors.error}`)
      ) as MovieResult;

    const newActors = await this.getActors(data.actors?.new || []);
    const removeActors = await this.getActors(data.actors?.removes || []);

    const newAuthors = await this.getAuthors(data.authors?.new || []);
    const removeAuthors = await this.getAuthors(data.authors?.removes || []);

    const movieOrError = Movie.create(
      {
        name: data.name ?? movie.name,
        year: data.year ?? movie.year,
        actors: this.overrideActor(movie.actors, newActors, removeActors),
        authors: this.overrideAuthor(movie.authors, newAuthors, removeAuthors)
      },
      movie.id
    );

    if (movieOrError.isFailure)
      return left(new BadRequest(movieOrError.error as string)) as MovieResult;

    const updatedMovie = await this.movieRepo.save(movieOrError.getValue());

    return right(Result.ok<Movie>(updatedMovie)) as MovieResult;
  }
}
