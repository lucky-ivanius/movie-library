Feature: Create movie

  Scenario: Create movie with valid details (without actors/authors)
    Given a valid movie details
    When attempt to create movie
    Then movie should be created successfully

  Scenario: Create movie with valid details (with valid actors/authors)
    Given a valid movie details
    And valid actor/author identity list
    When attempt to create movie
    Then movie should be created successfully

  Scenario: Create movie with valid details (with invalid actors/authors identity)
    Given a valid movie details
    And invalid actor/author identity list
    When attempt to create movie
    Then movie should be created successfully

  Scenario: Create movie with valid details (with invalid actors/authors identity format)
    Given a valid movie details
    And invalid actor/author identity format list
    When attempt to create movie
    Then get invalid identity error
  
  Scenario: Create movie with invalid details
    Given an invalid movie details
    When attempt to create movie
    Then get movie details error