import { UpdateMovieResolver } from './updateMovieResolver';
import { UpdateMovieUseCase } from './updateMovieUseCase';
import { actorRepo, authorRepo, movieRepo } from '../../repos';

const updateMovieUseCase = new UpdateMovieUseCase(
  movieRepo,
  actorRepo,
  authorRepo
);
const updateMovieResolver = new UpdateMovieResolver(updateMovieUseCase);

export { updateMovieUseCase, updateMovieResolver };
