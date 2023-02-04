import { BadRequest, InvalidId } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Movie } from '../../domain/movie';
import { IMovieRepo } from '../../repos/movieRepo';
import { IActorRepo } from '../../repos/actorRepo';

import { CreateMovieDTO } from './createMovieDTO';
import { IAuthorRepo } from '../../repos/authorRepo';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | BadRequest;

export type MovieResult = Either<Errors, Result<Movie>>;

export class CreateMovieUseCase
  implements UseCase<CreateMovieDTO, MovieResult>
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

  async execute(input: CreateMovieDTO) {
    const { name, year, actors, authors } = input.data ?? {};

    const validateActors = TextUtil.validateUUIDs(actors || []);
    if (!validateActors.isValid)
      return left(
        new InvalidId(`Invalid Actor ID: ${validateActors.error}`)
      ) as MovieResult;

    const validateAuthors = TextUtil.validateUUIDs(authors || []);
    if (!validateAuthors.isValid)
      return left(
        new InvalidId(`Invalid Author ID: ${validateAuthors.error}`)
      ) as MovieResult;

    const movieOrError = Movie.create({
      name,
      year,
      actors: await this.getActors(actors || []),
      authors: await this.getAuthors(authors || [])
    });

    if (movieOrError.isFailure)
      return left(new BadRequest(movieOrError.error as string)) as MovieResult;

    const createdMovie = await this.movieRepo.save(movieOrError.getValue());

    return right(Result.ok<Movie>(createdMovie)) as MovieResult;
  }
}
