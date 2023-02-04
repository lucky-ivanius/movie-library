import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { AuthorRepo } from '../../repos/authorRepo';
import { UpdateAuthorUseCase } from './updateAuthorUseCase';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './updateAuthor.feature'));

defineFeature(feature, async (test) => {
  const { models } = sequelize;

  const authorRepo = new AuthorRepo(models);
  const updateAuthorUseCase = new UpdateAuthorUseCase(authorRepo);

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

  test('Update author with valid details', ({ given, when, then }) => {
    given('a valid author details', () => {
      id = dummyAuthor.id;
      fullName = faker.name.fullName();
    });

    when('attempt to update author details', async () => {
      useCaseResult = await updateAuthorUseCase.execute({
        id,
        data: {
          fullName
        }
      });
    });

    then('author should be updated successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Update author with invalid identity format', ({
    given,
    when,
    then
  }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
      fullName = faker.name.fullName();
    });

    when('attempt to update author details', async () => {
      useCaseResult = await updateAuthorUseCase.execute({
        id,
        data: {
          fullName
        }
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

  test('Update author with invalid identity', ({ given, when, then }) => {
    given('an invalid author identity', () => {
      id = new UniqueID().toString();
      fullName = faker.name.fullName();
    });

    when('attempt to update author details', async () => {
      useCaseResult = await updateAuthorUseCase.execute({
        id,
        data: {
          fullName
        }
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

  test('Update author with invalid details', ({ given, when, then }) => {
    given('an invalid author details', () => {
      id = dummyAuthor.id;
      fullName = 'XD';
    });

    when('attempt to update author details', async () => {
      useCaseResult = await updateAuthorUseCase.execute({
        id,
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
