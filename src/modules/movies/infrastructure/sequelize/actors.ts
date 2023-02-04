import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes
} from 'sequelize';
import { sequelize } from '../../../../infrastructure/sequelize';

class Actor extends Model<
  InferAttributes<Actor>,
  InferCreationAttributes<Actor>
> {
  declare id: CreationOptional<string>;
  declare fullName: string;
}

Actor.init(
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
    tableName: 'actors',
    sequelize
  }
);

Actor.sync().catch((err) => {
  console.log(err);
});

export { Actor };
