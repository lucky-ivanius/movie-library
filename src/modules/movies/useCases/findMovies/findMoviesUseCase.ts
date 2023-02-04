import { Either, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { MovieCollection } from '../../domain/movie';
import { IMovieRepo } from '../../repos/movieRepo';
import { FindMoviesDTO } from './findMoviesDTO';

type Errors = null;

type MovieResult = Either<Errors, Result<MovieCollection>>;

export class FindMoviesUseCase implements UseCase<FindMoviesDTO, MovieResult> {
  private movieRepo: IMovieRepo;

  constructor(movieRepo: IMovieRepo) {
    this.movieRepo = movieRepo;
  }

  async execute(input: FindMoviesDTO) {
    const movies = await this.movieRepo.findMovies(input);

    return right(Result.ok<MovieCollection>(movies)) as MovieResult;
  }
}
