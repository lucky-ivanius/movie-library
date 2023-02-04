import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Movie } from '../../domain/movie';
import { IMovieRepo } from '../../repos/movieRepo';
import { FindMovieByIdDTO } from './findMovieByIdDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound;

type MovieResult = Either<Errors, Result<Movie>>;

export class FindMovieByIdUseCase
  implements UseCase<FindMovieByIdDTO, MovieResult>
{
  private movieRepo: IMovieRepo;

  constructor(movieRepo: IMovieRepo) {
    this.movieRepo = movieRepo;
  }

  async execute(input: FindMovieByIdDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Movie ID: ${id}`)) as MovieResult;

    const movie = await this.movieRepo.findMovieById(id);

    if (movie) return right(Result.ok<Movie>(movie)) as MovieResult;

    return left(new NotFound(id, 'Movie')) as MovieResult;
  }
}
