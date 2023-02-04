Feature: Update movie details
  # from this
  Scenario: Update movie with valid details (without actors/authors)
    Given a valid movie details
    When attempt to update movie
    Then movie should be updated successfully

  Scenario: Update movie with valid details (with valid actors/authors)
    Given a valid movie details
    And valid actor/author identity list
    When attempt to update movie
    Then movie should be updated successfully

  Scenario: Update movie with valid details (with invalid actors/authors identity)
    Given a valid movie details
    And invalid actor/author identity list
    When attempt to update movie
    Then movie should be updated successfully

  Scenario: Update movie with valid details (with invalid actors/authors identity format)
    Given a valid movie details
    And invalid actor/author identity format list
    When attempt to update movie
    Then get invalid identity error
  # to this
  Scenario: Update movie with invalid identity format
    Given an invalid identity format
    When attempt to update movie
    Then get invalid identity error

  Scenario: Update movie with invalid identity
    Given an invalid movie identity
    When attempt to update movie
    Then get not found error

  Scenario: Update movie with invalid details
    Given an invalid movie details
    When attempt to update movie
    Then get movie details error

