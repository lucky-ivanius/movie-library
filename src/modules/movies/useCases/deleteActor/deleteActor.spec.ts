import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { ActorRepo } from '../../repos/actorRepo';
import { DeleteActorUseCase } from './deleteActorUseCase';
import { InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './deleteActor.feature'));

defineFeature(feature, (test) => {
  const { models } = sequelize;

  const actorRepo = new ActorRepo(models);
  const deleteActorUseCase = new DeleteActorUseCase(actorRepo);

  let useCaseResult: any;

  let dummyActor: any;
  let id: string;

  beforeEach(async () => {
    dummyActor = await models.Actor.create({
      fullName: faker.name.fullName()
    });
  });

  afterAll(async () => {
    await models.Actor.destroy({
      where: {}
    });
  });

  test('Delete actor with valid identity', ({ given, when, then }) => {
    given('a valid actor identity', () => {
      id = dummyActor.id;
    });

    when('attempt to delete actor', async () => {
      useCaseResult = await deleteActorUseCase.execute({
        id
      });
    });

    then('actor should be deleted successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue).toContain(id);

      const deletedActor = await actorRepo.findActorById(id);
      expect(deletedActor).toBeNull();
    });
  });

  test('Delete actor with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
    });

    when('attempt to delete actor', async () => {
      useCaseResult = await deleteActorUseCase.execute({
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

  test('Delete actor with invalid identity', ({ given, when, then }) => {
    given('an invalid actor identity', () => {
      id = new UniqueID().toString();
    });

    when('attempt to delete actor', async () => {
      useCaseResult = await deleteActorUseCase.execute({
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
