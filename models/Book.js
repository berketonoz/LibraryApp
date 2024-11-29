import { DataTypes } from "sequelize";

const defineBook = (sequelize) => {
  return sequelize.define(
    "Book",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      average_score: { type: DataTypes.FLOAT, defaultValue: null },
    },
    {
      tableName: "books",
      timestamps: false, // Disable createdAt and updatedAt
    }
  );
};

export default defineBook;
