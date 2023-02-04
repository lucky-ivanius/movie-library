Feature: Find movies

  Scenario: Find movies without any details
    Given nothing
    When attempt to find movies
    Then get a list of all movie with the details
  
  Scenario: Find movies with valid details
    Given a valid movie details
    When attempt to find movies
    Then get a list of movie with the details

  Scenario: Find movies with invalid details
    Given a random/invalid movie details
    When attempt to find movies
    Then get an empty list
