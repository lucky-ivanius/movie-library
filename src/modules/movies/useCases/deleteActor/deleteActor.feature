Feature: Delete actor

  Scenario: Delete actor with valid identity
    Given a valid actor identity
    When attempt to delete actor
    Then actor should be deleted successfully

  Scenario: Delete actor with invalid identity format
    Given an invalid identity format
    When attempt to delete actor
    Then get invalid identity error

  Scenario: Delete actor with invalid identity
    Given an invalid actor identity
    When attempt to delete actor
    Then get not found error
