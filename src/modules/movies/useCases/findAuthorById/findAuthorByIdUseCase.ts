import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Author } from '../../domain/author';
import { IAuthorRepo } from '../../repos/authorRepo';
import { FindAuthorByIdDTO } from './findAuthorByIdDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | NotFound;

type AuthorResult = Either<Errors, Result<Author>>;

export class FindAuthorByIdUseCase
  implements UseCase<FindAuthorByIdDTO, AuthorResult>
{
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
  }

  async execute(input: FindAuthorByIdDTO) {
    const { id } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Author ID: ${id}`)) as AuthorResult;

    const author = await this.authorRepo.findAuthorById(id);

    if (author) return right(Result.ok<Author>(author)) as AuthorResult;

    return left(new NotFound(id, 'Author')) as AuthorResult;
  }
}
