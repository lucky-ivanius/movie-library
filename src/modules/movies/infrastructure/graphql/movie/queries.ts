import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { findMovieByIdResolver } from '../../../useCases/findMovieById';
import { findMoviesResolver } from '../../../useCases/findMovies';

import { movie } from './types';

export const findMovieById = {
  type: movie,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: findMovieByIdResolver.resolve
};

export const findMovies = {
  type: new GraphQLList(movie),
  args: {
    name: {
      type: GraphQLString
    },
    year: {
      type: GraphQLString
    }
  },
  resolve: findMoviesResolver.resolve
};
