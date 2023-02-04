import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  Association
} from 'sequelize';
import { sequelize } from '../../../../infrastructure/sequelize';
import { Actor } from './actors';
import { Author } from './authors';

class Movie extends Model<
  InferAttributes<Movie>,
  InferCreationAttributes<Movie>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare year: number;

  declare actors?: NonAttribute<Actor[]>;
  declare authors?: NonAttribute<Author[]>;

  declare static associations: {
    actors: Association<Movie, Actor>;
    authors: Association<Movie, Author>;
  };
}
Movie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.INTEGER
    }
  },
  {
    timestamps: true,
    tableName: 'movies',
    sequelize
  }
);

class MovieActor extends Model<
  InferAttributes<MovieActor>,
  InferCreationAttributes<MovieActor>
> {
  declare id: CreationOptional<string>;
}
MovieActor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  },
  {
    tableName: 'movie_actors',
    sequelize
  }
);
Movie.belongsToMany(Actor, {
  through: MovieActor,
  foreignKey: 'movieId'
});
Actor.belongsToMany(Movie, {
  through: MovieActor,
  foreignKey: 'actorId'
});

class MovieAuthor extends Model<
  InferAttributes<MovieAuthor>,
  InferCreationAttributes<MovieAuthor>
> {
  declare id: CreationOptional<string>;
}
MovieAuthor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  },
  {
    tableName: 'movie_authors',
    sequelize
  }
);
Movie.belongsToMany(Author, { through: MovieAuthor, foreignKey: 'movieId' });
Author.belongsToMany(Movie, { through: MovieAuthor, foreignKey: 'authorId' });

Movie.sync().catch((err) => {
  console.log(err);
});

MovieActor.sync().catch((err) => {
  console.log(err);
});

MovieAuthor.sync().catch((err) => {
  console.log(err);
});

export { Movie, MovieActor, MovieAuthor };
