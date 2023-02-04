import { FindActorByIdResolver } from './findActorByIdResolver';
import { FindActorByIdUseCase } from './findActorByIdUseCase';
import { actorRepo } from '../../repos';

const findActorByIdUseCase = new FindActorByIdUseCase(actorRepo);
const findActorByIdResolver = new FindActorByIdResolver(findActorByIdUseCase);

export { findActorByIdUseCase, findActorByIdResolver };
