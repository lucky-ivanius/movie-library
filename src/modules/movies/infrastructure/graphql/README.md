## GraphQL Schema

### Types

Actor

```gql
type Actor {
  id: UniqueID
  fullName: String
  createdAt: Float
  updatedAt: Float
}
```

Author

```gql
type Author {
  id: UniqueID
  fullName: String
  createdAt: Float
  updatedAt: Float
}
```

Movie

```gql
type Movie {
  id: UniqueID
  name: String
  year: Int
  actors: [Actor]
  authors: [Author]
  createdAt: Float
  updatedAt: Float
}
```

Actor Inputs

```gql
type CreateActorInput {
  fullName: String!
}
```

```gql
type UpdateActorInput {
  fullName: String
}
```

Author Inputs

```gql
type CreateAuthorInput {
  fullName: String!
}
```

```gql
type UpdateAuthorInput {
  fullName: String
}
```

Movie Inputs

```gql
type CreateMovieInput {
  name: String
  year: Int
  actors: [ID]
  authors: [ID]
}
```

```gql
type UpdateMovieInput {
  name: String
  year: Int
  actors: UpdateMovieDetailListInput
  authors: UpdateMovieDetailListInput
}
```

```gql
type UpdateMovieDetailListInput {
  new: [ID]
  removes: [ID]
}
```

### Queries

```gql
type Query {
  actor(id: ID!): Actor
  actors(fullName: String): [Actor]
  author(id: ID!): Author
  authors(fullName: String): [Author]
  movie(id: ID!): Movie
  movies(name: String, year: String): [Movie]
}
```

### Mutation

```gql
type Mutation {
  createActor(data: CreateActorInput): Actor
  updateActor(id: ID, data: UpdateActorInput): Actor
  deleteActor(id: ID): String
  createAuthor(data: CreateAuthorInput): Author
  updateAuthor(id: ID, data: UpdateAuthorInput): Author
  deleteAuthor(id: ID): String
  createMovie(data: CreateMovieInput): Movie
  updateMovie(id: ID, data: UpdateMovieInput): Movie
  deleteMovie(id: ID): String
}
```
