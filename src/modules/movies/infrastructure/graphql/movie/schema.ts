import { createMovie, updateMovie, deleteMovie } from './mutations';
import { findMovieById, findMovies } from './queries';

export const movieQueries = {
  movie: findMovieById,
  movies: findMovies
};

export const movieMutations = {
  createMovie,
  updateMovie,
  deleteMovie
};
