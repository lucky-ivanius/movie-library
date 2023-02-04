import { DeleteActorResolver } from './deleteActorResolver';
import { DeleteActorUseCase } from './deleteActorUseCase';
import { actorRepo } from '../../repos';

const deleteActorUseCase = new DeleteActorUseCase(actorRepo);
const deleteActorResolver = new DeleteActorResolver(deleteActorUseCase);

export { deleteActorUseCase, deleteActorResolver };
