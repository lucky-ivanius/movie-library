import {
  InvalidId,
  NotFound,
  UnsuccessfulOperation
} from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { IMovieRepo } from '../../repos/movieRepo';
import { DeleteMovieDTO } from './deleteMovieDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound | UnsuccessfulOperation;

type MovieResult = Either<Errors, Result<string>>;

export class DeleteMovieUseCase
  implements UseCase<DeleteMovieDTO, MovieResult>
{
  private movieRepo: IMovieRepo;

  constructor(movieRepo: IMovieRepo) {
    this.movieRepo = movieRepo;
  }

  async execute(input: DeleteMovieDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Movie ID: ${id}`)) as MovieResult;

    const movie = await this.movieRepo.findMovieById(id);
    if (!movie) return left(new NotFound(id, 'Movie')) as MovieResult;

    const deletedMovie = await this.movieRepo.remove(id);
    if (!deletedMovie)
      return left(
        new UnsuccessfulOperation('Unsuccesful operation')
      ) as MovieResult;

    return right(Result.ok<string>(id)) as MovieResult;
  }
}
