import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { MovieRepo } from '../../repos/movieRepo';
import { DeleteMovieUseCase } from './deleteMovieUseCase';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './deleteMovie.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const movieRepo = new MovieRepo(models);
  const deleteMovieUseCase = new DeleteMovieUseCase(movieRepo);

  let useCaseResult: any;

  let dummyMovie: any;
  let id: string;

  beforeEach(async () => {
    dummyMovie = await models.Movie.create({
      name: 'Iron Man',
      year: 2008
    });
  });

  afterAll(async () => {
    await models.Movie.destroy({
      where: {}
    });
  });

  test('Delete movie with valid identity', ({ given, when, then }) => {
    given('a valid movie identity', () => {
      id = dummyMovie.id.toString();
    });

    when('attempt to delete movie', async () => {
      useCaseResult = await deleteMovieUseCase.execute({
        id
      });
    });

    then('movie should be deleted successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toContain(id);

      const deletedMovie = await movieRepo.findMovieById(id);
      expect(deletedMovie).toBeNull();
    });
  });

  test('Delete movie with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
    });

    when('attempt to delete movie', async () => {
      useCaseResult = await deleteMovieUseCase.execute({
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

  test('Delete movie with invalid identity', ({ given, when, then }) => {
    given('an invalid movie identity', () => {
      id = new UniqueID().toString();
    });

    when('attempt to delete movie', async () => {
      useCaseResult = await deleteMovieUseCase.execute({
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
