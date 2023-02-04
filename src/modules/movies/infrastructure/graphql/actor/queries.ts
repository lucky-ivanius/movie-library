import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { findActorByIdResolver } from '../../../useCases/findActorById';
import { findActorsResolver } from '../../../useCases/findActors';

import { actor } from './types';

export const findActorById = {
  type: actor,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: findActorByIdResolver.resolve
};

export const findActors = {
  type: new GraphQLList(actor),
  args: {
    fullName: {
      type: GraphQLString
    }
  },
  resolve: findActorsResolver.resolve
};
