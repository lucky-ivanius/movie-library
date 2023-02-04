import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '../../../../infrastructure/sequelize';

class Author extends Model<
  InferAttributes<Author>,
  InferCreationAttributes<Author>
> {
  declare id: CreationOptional<string>;
  declare fullName: string;
}

Author.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: true,
    tableName: 'authors',
    sequelize
  }
);

Author.sync().catch((err) => {
  console.log(err);
});

export { Author };
