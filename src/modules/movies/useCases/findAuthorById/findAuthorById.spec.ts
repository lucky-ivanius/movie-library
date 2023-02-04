import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { AuthorRepo } from '../../repos/authorRepo';
import { FindAuthorByIdUseCase } from './findAuthorByIdUseCase';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './findAuthorById.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const authorRepo = new AuthorRepo(models);
  const findAuthorByIdUseCase = new FindAuthorByIdUseCase(authorRepo);

  let useCaseResult: any;

  let dummyAuthor: any;

  let id: string;
  let fullName: string;

  beforeEach(async () => {
    fullName = faker.name.fullName();
    dummyAuthor = await models.Author.create({
      fullName
    });
  });

  afterAll(async () => {
    await models.Author.destroy({
      where: {}
    });
  });

  test('Find author with valid identity', ({ given, when, then }) => {
    given('a valid author identity', () => {
      id = dummyAuthor.id;
    });

    when('attempt to find author', async () => {
      useCaseResult = await findAuthorByIdUseCase.execute({
        id
      });
    });

    then('details of author should be defined', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id.value).toBe(id);
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Find author with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
    });

    when('attempt to find author', async () => {
      useCaseResult = await findAuthorByIdUseCase.execute({
        id
      });
    });

    then('get invalid identity error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(InvalidId);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });

  test('Find author with invalid identity', ({ given, when, then }) => {
    given('an invalid author identity', () => {
      id = new UniqueID().toString();
    });

    when('attempt to find author', async () => {
      useCaseResult = await findAuthorByIdUseCase.execute({
        id
      });
    });

    then('get not found error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(NotFound);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });
});
