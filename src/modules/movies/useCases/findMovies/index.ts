import { FindMoviesResolver } from './findMoviesResolver';
import { FindMoviesUseCase } from './findMoviesUseCase';
import { movieRepo } from '../../repos';

const findMoviesUseCase = new FindMoviesUseCase(movieRepo);
const findMoviesResolver = new FindMoviesResolver(findMoviesUseCase);

export { findMoviesUseCase, findMoviesResolver };
