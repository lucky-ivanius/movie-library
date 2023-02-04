import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { AuthorRepo } from '../../repos/authorRepo';
import { FindAuthorsUseCase } from './findAuthorsUseCase';

const feature = loadFeature(path.join(__dirname, './findAuthors.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const authorRepo = new AuthorRepo(models);
  const findAuthorsUseCase = new FindAuthorsUseCase(authorRepo);

  let useCaseResult: any;

  let fullName: string;
  let firstName: string;

  beforeAll(async () => {
    firstName = faker.name.firstName();
    await models.Author.bulkCreate(
      [...Array(6).keys()].map(() => ({
        fullName: faker.name.fullName({
          firstName
        })
      }))
    );
    await models.Author.bulkCreate(
      [...Array(4).keys()].map(() => ({
        fullName: faker.name.fullName()
      }))
    );
  });

  afterAll(async () => {
    await models.Author.destroy({
      where: {}
    });
  });

  test('Find authors without any details', ({ given, when, then }) => {
    given('nothing', () => {
      fullName = '';
    });

    when('attempt to find authors', async () => {
      useCaseResult = await findAuthorsUseCase.execute({
        fullName
      });
    });

    then('get a list of all author with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(10);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].fullName).toBeDefined();
    });
  });

  test('Find authors with valid details', ({ given, when, then }) => {
    given('a valid author details', () => {
      fullName = firstName;
    });

    when('attempt to find authors', async () => {
      useCaseResult = await findAuthorsUseCase.execute({
        fullName
      });
    });

    then('get a list of author with the details', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(6);
      expect(resultValue[0].id).toBeDefined();
      expect(resultValue[0].fullName).toBeDefined();
    });
  });

  test('Find authors with invalid details', ({ given, when, then }) => {
    given('a random/invalid author details', () => {
      fullName = 'random';
    });

    when('attempt to find authors', async () => {
      useCaseResult = await findAuthorsUseCase.execute({ fullName });
    });

    then('get an empty list', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toBeInstanceOf(Array);
      expect(resultValue.length).toBe(0);
    });
  });
});
