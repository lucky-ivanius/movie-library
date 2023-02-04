import { CreateMovieResolver } from './createMovieResolver';
import { CreateMovieUseCase } from './createMovieUseCase';
import { actorRepo, authorRepo, movieRepo } from '../../repos';

const createMovieUseCase = new CreateMovieUseCase(
  movieRepo,
  actorRepo,
  authorRepo
);
const createMovieResolver = new CreateMovieResolver(createMovieUseCase);

export { createMovieUseCase, createMovieResolver };
