Feature: Find actors

  Scenario: Find actors without any details
    Given nothing
    When attempt to find actors
    Then get a list of all actor with the details
  
  Scenario: Find actors with valid details
    Given a valid actor details
    When attempt to find actors
    Then get a list of actor with the details

  Scenario: Find actors with invalid details
    Given a random/invalid actor details
    When attempt to find actors
    Then get an empty list
