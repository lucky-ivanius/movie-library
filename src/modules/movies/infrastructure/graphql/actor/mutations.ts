import { GraphQLID, GraphQLString } from 'graphql';
import { createActorResolver } from '../../../useCases/createActor';
import { deleteActorResolver } from '../../../useCases/deleteActor';

import { updateActorResolver } from '../../../useCases/updateActor';

import { actor, createActorInput, updateActorInput } from './types';

export const createActor = {
  type: actor,
  args: {
    data: {
      type: createActorInput
    }
  },
  resolve: createActorResolver.resolve
};

export const updateActor = {
  type: actor,
  args: {
    id: {
      type: GraphQLID
    },
    data: {
      type: updateActorInput
    }
  },
  resolve: updateActorResolver.resolve
};

export const deleteActor = {
  type: GraphQLString,
  args: {
    id: {
      type: GraphQLID
    }
  },
  resolve: deleteActorResolver.resolve
};
