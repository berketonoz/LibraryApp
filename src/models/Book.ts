import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database';

class Book extends Model {
  public id!: number;
  public name!: string;
  public average_score!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    average_score: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
  },
  {
    tableName: 'books',
    sequelize,
  }
);

export default Book;
