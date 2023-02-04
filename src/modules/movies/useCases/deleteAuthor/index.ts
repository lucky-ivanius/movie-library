import { DeleteAuthorResolver } from './deleteAuthorResolver';
import { DeleteAuthorUseCase } from './deleteAuthorUseCase';
import { authorRepo } from '../../repos';

const deleteAuthorUseCase = new DeleteAuthorUseCase(authorRepo);
const deleteAuthorResolver = new DeleteAuthorResolver(deleteAuthorUseCase);

export { deleteAuthorUseCase, deleteAuthorResolver };
