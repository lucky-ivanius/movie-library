import { UpdateAuthorResolver } from './updateAuthorResolver';
import { UpdateAuthorUseCase } from './updateAuthorUseCase';
import { authorRepo } from '../../repos';

const updateAuthorUseCase = new UpdateAuthorUseCase(authorRepo);
const updateAuthorResolver = new UpdateAuthorResolver(updateAuthorUseCase);

export { updateAuthorUseCase, updateAuthorResolver };
