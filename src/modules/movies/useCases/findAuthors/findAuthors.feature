Feature: Find authors

  Scenario: Find authors without any details
    Given nothing
    When attempt to find authors
    Then get a list of all author with the details
  
  Scenario: Find authors with valid details
    Given a valid author details
    When attempt to find authors
    Then get a list of author with the details

  Scenario: Find authors with invalid details
    Given a random/invalid author details
    When attempt to find authors
    Then get an empty list
