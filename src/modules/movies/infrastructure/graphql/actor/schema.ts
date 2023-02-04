import { createActor, updateActor, deleteActor } from './mutations';
import { findActorById, findActors } from './queries';

export const actorQueries = {
  actor: findActorById,
  actors: findActors
};

export const actorMutations = {
  createActor,
  updateActor,
  deleteActor
};
