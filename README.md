# Movie Library

> Simple movie library - Back-end only.

## Stacks

- Node.js
- TypeScript
- Sequelize.js
- GraphQL

## Modules

- Movies
  - Movie
  - Actor
  - Author

## Installation

Clone the repository:

```
git clone https://github.com/lucky-ivanius/movie-library.git
```

Install dependencies:

```
npm install
```

## Environment

Rename ```.env.example``` to ```.env```

### Variables

- PORT = Application port (default:4000)
- DATABASE_URL = PostgreSQL connection string

## Usage

Build the application:

```
npm run build
```

Start the server:

```
npm start
```

Start the server in development mode (with nodemon):

```
npm run start:dev
```

## GraphQL

You can click [`here`](./src/modules/movies/infrastructure/graphql/README.md) for GraphQL Docs.

## Scripts

- `build`: Cleans the build directory and runs the TypeScript compiler.
- `start`: Runs the `build` script and starts the server.
- `start:dev`: Runs the server with nodemon for development.
- `prettier-format`: Formats the TypeScript code using Prettier.
- `prettier-watch`: Watches the TypeScript code and formats it using Prettier on change.
- `lint`: Runs ESLint on the codebase.
- `lint-and-fix`: Runs ESLint on the codebase and fixes any issues.
- `test`: Runs tests using Jest.
- `test:dev`: Runs tests using Jest in watch mode.
- `prepare`: Installs Husky for Git hooks.

## Author

Lucky Ivanius (luckzivanius@gmail.com)
