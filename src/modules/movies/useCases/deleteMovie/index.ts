import { DeleteMovieResolver } from './deleteMovieResolver';
import { DeleteMovieUseCase } from './deleteMovieUseCase';
import { movieRepo } from '../../repos';

const deleteMovieUseCase = new DeleteMovieUseCase(movieRepo);
const deleteMovieResolver = new DeleteMovieResolver(deleteMovieUseCase);

export { deleteMovieUseCase, deleteMovieResolver };
