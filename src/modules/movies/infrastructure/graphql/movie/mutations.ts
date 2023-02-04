import { GraphQLID, GraphQLString } from 'graphql';
import { createMovieResolver } from '../../../useCases/createMovie';
import { deleteMovieResolver } from '../../../useCases/deleteMovie';

import { updateMovieResolver } from '../../../useCases/updateMovie';

import { movie, createMovieInput, updateMovieInput } from './types';

export const createMovie = {
  type: movie,
  args: {
    data: {
      type: createMovieInput
    }
  },
  resolve: createMovieResolver.resolve
};

export const updateMovie = {
  type: movie,
  args: {
    id: {
      type: GraphQLID
    },
    data: {
      type: updateMovieInput
    }
  },
  resolve: updateMovieResolver.resolve
};

export const deleteMovie = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLID
    }
  },
  resolve: deleteMovieResolver.resolve
};
