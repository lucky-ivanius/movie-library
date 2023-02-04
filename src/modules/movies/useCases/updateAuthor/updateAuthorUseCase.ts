import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';
import { Either, left, right } from '../../../../core/logic/Either';
import { Result } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';

import { Author } from '../../domain/author';
import { IAuthorRepo } from '../../repos/authorRepo';
import { UpdateAuthorDTO } from './updateAuthorDTO';
import { TextUtil } from '../../../../utils/TextUtils';

type Errors = InvalidId | BadRequest | NotFound;

type AuthorResult = Either<Errors, Result<Author>>;

export class UpdateAuthorUseCase
  implements UseCase<UpdateAuthorDTO, AuthorResult>
{
  private authorRepo: IAuthorRepo;

  constructor(authorRepo: IAuthorRepo) {
    this.authorRepo = authorRepo;
  }

  async execute(input: UpdateAuthorDTO) {
    const { id, data } = input;
    const validId = TextUtil.isUUID(id);
    if (!validId)
      return left(new InvalidId(`Invalid Author ID: ${id}`)) as AuthorResult;

    const author = await this.authorRepo.findAuthorById(id);
    if (!author) return left(new NotFound(id, 'Author')) as AuthorResult;

    const authorOrError = Author.create(
      {
        fullName: data.fullName ?? author.fullName
      },
      author.id
    );

    if (authorOrError.isFailure)
      return left(
        new BadRequest(authorOrError.error as string)
      ) as AuthorResult;

    const updatedAuthor = await this.authorRepo.save(authorOrError.getValue());

    return right(Result.ok<Author>(updatedAuthor)) as AuthorResult;
  }
}
