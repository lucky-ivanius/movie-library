import { FindMovieByIdResolver } from './findMovieByIdResolver';
import { FindMovieByIdUseCase } from './findMovieByIdUseCase';
import { movieRepo } from '../../repos';

const findMovieByIdUseCase = new FindMovieByIdUseCase(movieRepo);
const findMovieByIdResolver = new FindMovieByIdResolver(findMovieByIdUseCase);

export { findMovieByIdUseCase, findMovieByIdResolver };
