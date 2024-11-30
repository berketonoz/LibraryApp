// src/models/Book.ts

import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '../config/database';
import Borrow from './Borrow';

class Book extends Model {
  public id!: number;
  public name!: string;
  public average_score!: number | null;
  public borrows?: Borrow[];

  public static associations: {
    borrows: Association<Book, Borrow>;
  };
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // Use INTEGER.UNSIGNED for unsigned integer
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128), // DataTypes.STRING is sufficient
      allowNull: false,
    },
    average_score: {
      type: DataTypes.FLOAT, // Use FLOAT for floating-point number
      allowNull: true,
    },
  },
  {
    tableName: 'books',
    timestamps: false, // To disable sequelize's timestamp feature
    sequelize, // Pass the sequelize instance here
  }
);

export default Book;
