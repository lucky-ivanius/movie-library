import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { MovieRepo } from '../../repos/movieRepo';
import { FindMovieByIdUseCase } from './findMovieByIdUseCase';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './findMovieById.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const movieRepo = new MovieRepo(models);
  const findMovieByIdUseCase = new FindMovieByIdUseCase(movieRepo);

  let useCaseResult: any;

  let dummyMovie: any;

  let id: string;
  let name: string;
  let year: number;

  beforeEach(async () => {
    name = faker.random.words(2);
    year = 2000;
    dummyMovie = await models.Movie.create({
      name,
      year
    });
  });

  afterAll(async () => {
    await models.Movie.destroy({
      where: {}
    });
  });

  test('Find movie with valid identity', ({ given, when, then }) => {
    given('a valid movie identity', () => {
      id = dummyMovie.id;
    });

    when('attempt to find movie', async () => {
      useCaseResult = await findMovieByIdUseCase.execute({
        id
      });
    });

    then('details of movie should be defined', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id.value).toBe(id);
      expect(resultValue.name).toBe(name);
      expect(resultValue.year).toBe(year);
      expect(resultValue.actors).toBeDefined();
      expect(resultValue.authors).toBeDefined();
    });
  });

  test('Find movie with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
    });

    when('attempt to find movie', async () => {
      useCaseResult = await findMovieByIdUseCase.execute({
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

  test('Find movie with invalid identity', ({ given, when, then }) => {
    given('an invalid movie identity', () => {
      id = new UniqueID().toString();
    });

    when('attempt to find movie', async () => {
      useCaseResult = await findMovieByIdUseCase.execute({
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
