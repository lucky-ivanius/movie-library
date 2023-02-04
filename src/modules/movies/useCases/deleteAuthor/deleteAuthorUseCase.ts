import {
  InvalidId,
  NotFound,
  UnsuccessfulOperation
} from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { IAuthorRepo } from '../../repos/authorRepo';
import { DeleteAuthorDTO } from './deleteAuthorDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound | UnsuccessfulOperation;

type AuthorResult = Either<Errors, Result<string>>;

export class DeleteAuthorUseCase
  implements UseCase<DeleteAuthorDTO, AuthorResult>
{
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
  }

  async execute(input: DeleteAuthorDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Author ID: ${id}`)) as AuthorResult;

    const author = await this.authorRepo.findAuthorById(id);
    if (!author) return left(new NotFound(id, 'Author')) as AuthorResult;

    const deletedAuthor = await this.authorRepo.remove(id);
    if (!deletedAuthor)
      return left(
        new UnsuccessfulOperation('Unsuccesful operation')
      ) as AuthorResult;

    return right(Result.ok<string>(id)) as AuthorResult;
  }
}
