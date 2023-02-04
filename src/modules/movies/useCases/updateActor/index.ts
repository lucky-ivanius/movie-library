import { UpdateActorResolver } from './updateActorResolver';
import { UpdateActorUseCase } from './updateActorUseCase';
import { actorRepo } from '../../repos';

const updateActorUseCase = new UpdateActorUseCase(actorRepo);
const updateActorResolver = new UpdateActorResolver(updateActorUseCase);

export { updateActorUseCase, updateActorResolver };
