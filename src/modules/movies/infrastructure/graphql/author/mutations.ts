import { GraphQLID, GraphQLString } from 'graphql';
import { createAuthorResolver } from '../../../useCases/createAuthor';
import { deleteAuthorResolver } from '../../../useCases/deleteAuthor';

import { updateAuthorResolver } from '../../../useCases/updateAuthor';

import { author, createAuthorInput, updateAuthorInput } from './types';

export const createAuthor = {
  type: author,
  args: {
    data: {
      type: createAuthorInput
    }
  },
  resolve: createAuthorResolver.resolve
};

export const updateAuthor = {
  type: author,
  args: {
    id: {
      type: GraphQLID
    },
    data: {
      type: updateAuthorInput
    }
  },
  resolve: updateAuthorResolver.resolve
};

export const deleteAuthor = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLID
    }
  },
  resolve: deleteAuthorResolver.resolve
};
