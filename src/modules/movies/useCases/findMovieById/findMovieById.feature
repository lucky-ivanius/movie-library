Feature: Find movie by id

  Scenario: Find movie with valid identity
    Given a valid movie identity
    When attempt to find movie
    Then details of movie should be defined

  Scenario: Find movie with invalid identity format
    Given an invalid identity format
    When attempt to find movie
    Then get invalid identity error

  Scenario: Find movie with invalid identity
    Given an invalid movie identity
    When attempt to find movie
    Then get not found error
