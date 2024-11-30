// src/models/Book.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Book extends Model {
  public id!: number;
  public name!: string;
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
  },
  {
    tableName: 'books',
    timestamps: false, // To disable sequelize's timestamp feature
    sequelize, // Pass the sequelize instance here
  }
);

export default Book;
