import { CreateActorResolver } from './createActorResolver';
import { CreateActorUseCase } from './createActorUseCase';
import { actorRepo } from '../../repos';

const createActorUseCase = new CreateActorUseCase(actorRepo);
const createActorResolver = new CreateActorResolver(createActorUseCase);

export { createActorUseCase, createActorResolver };
