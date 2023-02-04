import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { AuthorRepo } from '../../repos/authorRepo';
import { CreateAuthorUseCase } from './createAuthorUseCase';
import { BadRequest } from '../../../../core/logic/Errors';

const feature = loadFeature(path.join(__dirname, './createAuthor.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;
  const authorRepo = new AuthorRepo(models);
  const createAuthorUseCase = new CreateAuthorUseCase(authorRepo);

  let useCaseResult: any;

  let fullName: string;

  afterAll(async () => {
    await models.Author.destroy({
      where: {}
    });
  });

  test('Create author with valid details', ({ given, when, then }) => {
    given('a valid author details', () => {
      fullName = 'J. K. Rowling';
    });

    when('attempt to create author', async () => {
      useCaseResult = await createAuthorUseCase.execute({
        data: {
          fullName
        }
      });
    });

    then('author should be created successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Create author with invalid details', ({ given, when, then }) => {
    given('an invalid author details', () => {
      fullName = 'XD';
    });

    when('attempt to create author', async () => {
      useCaseResult = await createAuthorUseCase.execute({
        data: {
          fullName
        }
      });
    });

    then('get author details error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(BadRequest);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });
});
