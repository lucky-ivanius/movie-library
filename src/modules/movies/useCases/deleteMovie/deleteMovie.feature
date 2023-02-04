Feature: Delete movie

  Scenario: Delete movie with valid identity
    Given a valid movie identity
    When attempt to delete movie
    Then movie should be deleted successfully

  Scenario: Delete movie with invalid identity format
    Given an invalid identity format
    When attempt to delete movie
    Then get invalid identity error

  Scenario: Delete movie with invalid identity
    Given an invalid movie identity
    When attempt to delete movie
    Then get not found error
