import { Model, DataTypes } from "sequelize";
import sequelize from '../config/database';

class Borrow extends Model {
  public id!: number;
  public user_id!: number;
  public book_id!: number;
  public borrow_date!: Date;
  public return_date!: Date;
  public user_score!: number;
}

Borrow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    return_date: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    user_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10,
      },
    },
  },
  {
    tableName: "borrows",
    sequelize,
  }
);

export default Borrow;
