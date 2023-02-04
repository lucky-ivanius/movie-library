import path from 'path';
import { faker } from '@faker-js/faker';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sequelize } from '../../../../infrastructure/sequelize';
import '../../infrastructure/sequelize';

import { ActorRepo } from '../../repos/actorRepo';
import { UpdateActorUseCase } from './updateActorUseCase';
import { BadRequest, InvalidId, NotFound } from '../../../../core/logic/Errors';
import { UniqueID } from '../../../../core/domain/UniqueID';

const feature = loadFeature(path.join(__dirname, './updateActor.feature'));

defineFeature(feature, async (test) => {
  const { models } = sequelize;

  const actorRepo = new ActorRepo(models);
  const updateActorUseCase = new UpdateActorUseCase(actorRepo);

  let useCaseResult: any;

  let dummyActor: any;

  let id: string;
  let fullName: string;

  beforeEach(async () => {
    fullName = faker.name.fullName();
    dummyActor = await models.Actor.create({
      fullName
    });
  });

  afterAll(async () => {
    await models.Actor.destroy({
      where: {}
    });
  });

  test('Update actor with valid details', ({ given, when, then }) => {
    given('a valid actor details', () => {
      id = dummyActor.id;
      fullName = faker.name.fullName();
    });

    when('attempt to update actor details', async () => {
      useCaseResult = await updateActorUseCase.execute({
        id,
        data: {
          fullName
        }
      });
    });

    then('actor should be updated successfully', async () => {
      expect(useCaseResult.isLeft()).toBeFalsy();
      expect(useCaseResult.isRight()).toBeTruthy();
      expect(useCaseResult.value.isSuccess).toBeTruthy();
      expect(useCaseResult.value.isFailure).toBeFalsy();

      const resultValue = useCaseResult.value.getValue();
      expect(resultValue.id).toBeDefined();
      expect(resultValue.fullName).toBe(fullName);
    });
  });

  test('Update actor with invalid identity format', ({ given, when, then }) => {
    given('an invalid identity format', () => {
      id = 'invalid id';
      fullName = faker.name.fullName();
    });

    when('attempt to update actor details', async () => {
      useCaseResult = await updateActorUseCase.execute({
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

  test('Update actor with invalid identity', ({ given, when, then }) => {
    given('an invalid actor identity', () => {
      id = new UniqueID().toString();
      fullName = faker.name.fullName();
    });

    when('attempt to update actor details', async () => {
      useCaseResult = await updateActorUseCase.execute({
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

  test('Update actor with invalid details', ({ given, when, then }) => {
    given('an invalid actor details', () => {
      id = dummyActor.id;
      fullName = 'XD';
    });

    when('attempt to update actor details', async () => {
      useCaseResult = await updateActorUseCase.execute({
        id,
        data: {
          fullName
        }
      });
    });

    then('get actor details error', async () => {
      expect(useCaseResult.value).toBeInstanceOf(BadRequest);
      expect(useCaseResult.isLeft()).toBeTruthy();
      expect(useCaseResult.isRight()).toBeFalsy();
      expect(useCaseResult.value.isSuccess).toBeFalsy();
      expect(useCaseResult.value.isFailure).toBeTruthy();
    });
  });
});
